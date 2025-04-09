<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ItemStatus;
use App\Enums\QuestionDifficulty;
use App\Enums\QuestionType;
use App\Enums\TestType;
use App\Http\Controllers\Controller;
use App\Enums\JobStatus;
use App\Http\Resources\QuestionRecalibrationLogResource;
use App\Jobs\IRTItemAnalysisJob;
use App\Jobs\ItemAnalysisJob;
use App\Models\Course;
use App\Models\Question;
use App\Models\QuestionRecalibrationLog;
use App\Models\Recalibration;
use App\Services\FastApiService;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\RecalibrationResource;
use Inertia\Inertia;

class RecalibrationController extends Controller
{

    protected $fastapiService;

    public function __construct(FastApiService $fastApiService)
    {
        $this->fastapiService = $fastApiService;
    }

    public function index()
    {
        $query = Recalibration::query();

        if ($fromDate = request('from')) {
            $query->whereDate('created_at', '>=', $fromDate);
        }

        if ($toDate = request('to')) {
            $query->whereDate('created_at', '<=', $toDate);
        }
        if ($status = request('status')) {
            $query->where('status', $status);
        }

        $sort = request()->query('sort', '');
        $sortField = $sortDirection = null;
        // Only split if $sort is not empty
        if (!empty($sort)) {
            [$sortField, $sortDirection] = explode(':', $sort);

            // Ensure sortDirection is either 'asc' or 'desc', otherwise set it to null
            if (!in_array($sortDirection, ['asc', 'desc'])) {
                $sortDirection = null;
            }
        }
        if (!empty($sortField) && !empty($sortDirection)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'asc');
        }

        $perPage = request('items', 5);
        $recalibrations = $query->paginate($perPage)->onEachSide(1);
        $status = collect(JobStatus::cases())->map(function ($case) {
            return $case->value;
        })->toArray();

        $filters = [
            'status' => $status
        ];

        return Inertia::render('Admin/Recalibration/Index', [
            'filters' => $filters,
            'recalibrations' => RecalibrationResource::collection($recalibrations),
            'title' => 'Admin Recalibration',
            'queryParams' => request()->query() ?: null,
        ]);

    }
    public function show(int $id)
    {

        $query = QuestionRecalibrationLog::with([
            'question' => function ($q) {
                $q->with(['course'])
                    ->withCount('assessment_items')
                    ->withCount([
                        'assessment_items as correct_count' => function ($query) {
                            $query->where('score', '>', 0);
                        },
                        'assessment_items as incorrect_count' => function ($query) {
                            $query->where('score', '=', 0);
                        }
                    ]);
            }
        ])->where('recalibration_id', $id);

        $sort = request()->query('sort', '');
        $sortField = $sortDirection = null;

        // Only split if $sort is not empty
        if (!empty($sort)) {
            [$sortField, $sortDirection] = explode(':', $sort);

            if (!in_array($sortDirection, ['asc', 'desc'])) {
                $sortDirection = null;
            }
        }
        if ($search = request('question')) {
            $search = strtolower($search);

            $query->whereHas('question', function ($q) use ($search) {
                $q->whereRaw('LOWER(question) LIKE ?', ['%' . $search . '%'])
                    ->orWhereRaw('LOWER(answer) LIKE ?', ['%' . $search . '%']);
            });
        }
        if ($question_type = request('question_type')) {
            $query->whereHas('question', function ($q) use ($question_type) {
                $q->where('question_type', $question_type);
            });
        }
        if ($courseTitle = request('course')) {
            $query->whereHas('question.course', function ($q) use ($courseTitle) {
                $q->where('title', 'like', '%' . $courseTitle . '%');
            });
        }
        if ($difficulty = request('difficulty')) {
            $query->where('previous_difficulty_type', $difficulty)->orWhere('new_difficulty_type', $difficulty);
        }
        if ($question_type = request('question_type')) {
            $query->whereHas('question', function ($q) use ($question_type) {
                $q->where('question_type', $question_type);
            });
        }

        if (!empty($sortField) && !empty($sortDirection)) {
            if ($sortField === 'total_count') {
                $query->orderByRaw('(SELECT COUNT(*) FROM assessment_items WHERE assessment_items.question_id = question_recalibration_logs.question_id) ' . $sortDirection);
            } else if ($sortField === "discrimination_index" || $sortField === "difficulty_value") {
                $query->orderBy('new_' . $sortField, $sortDirection);
            }else {
                $query->orderBy($sortField, $sortDirection);
            }
        }

        $perPage = request('items', 5);
        $questions = $query->paginate($perPage)->onEachSide(1);

        $title = Course::select('title')->distinct()->pluck('title');
        $difficulty = array_map(fn($case) => $case->value, QuestionDifficulty::cases());
        $questionTypes = collect(QuestionType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();

        $testTypes = collect(TestType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();

        $filters = [
            'courses' => $title,
            'difficulty' => $difficulty,
            'question_type' => $questionTypes
        ];

        return Inertia::render('Admin/Recalibration/Logs', [
            'filters' => $filters,
            'recalibration_id' => $id,
            'questions' => QuestionRecalibrationLogResource::collection($questions),
            'title' => 'Admin Recalibration Logs',
            'queryParams' => request()->query() ?: null,
        ]);
    }


    public function recalibrate()
    {
        $exists = Recalibration::whereIn('status', [
            JobStatus::PROCESSING->value,
            JobStatus::PENDING->value
        ])->exists();


        if ($exists) {
            return redirect()->back()->withErrors(['message' => 'A recalibration job is already requested.']);
        }

        $recalibration_id = Recalibration::insertGetId([
            'status' => JobStatus::PENDING->value,
            'total_question_logs' => 0,
            'recalibrated_by' => Auth::user()->userable->firstname . ', ' . Auth::user()->userable->lastname,
        ]);

        $questionsData = Question::with([
            'assessment_items' => function ($query) {
                $query->select(
                    'assessment_items.assessment_item_id',
                    'assessment_items.question_id',
                    'assessment_items.score',
                    'assessment_items.previous_theta_score',
                    'assessment_items.assessment_course_id'
                )->where('assessment_items.status', ItemStatus::COMPLETED->value)
                    ->with(['assessment_course:assessment_courses.assessment_course_id,final_theta_score']);
            }
        ])->get()
            ->mapWithKeys(function ($question) {
                return [
                    $question->question_id => [
                        'difficulty_type' => $question->difficulty_type,
                        'difficulty_value' => $question->difficulty_value,
                        'discrimination_index' => $question->discrimination_index,
                        'assessment_items' => $question->assessment_items->map(fn($item) => [
                            'assessment_item_id' => $item->assessment_item_id,
                            'is_correct' => $item->score > 0 ? 1 : 0,
                            'theta' => $item->previous_theta_score,
                        ])->values()
                    ]
                ];
            });

        IRTItemAnalysisJob::dispatch($recalibration_id, $questionsData)->delay(1);

        // ItemAnalysisJob::dispatch($recalibration_id)->delay(1);
        // IRTItemAnalysisJob::dispatch($recalibration_id, $questionsData)->delay(1);

        return redirect()->back()->with(['message' => 'Recalibration job started successfully.']);

    }
}
