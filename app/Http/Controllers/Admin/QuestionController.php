<?php

namespace App\Http\Controllers\Admin;

use App\Enums\JobStatus;
use App\Enums\QuestionDifficulty;
use App\Enums\QuestionType;
use App\Enums\TestType;
use App\Http\Controllers\Controller;
use App\Http\Requests\BulkQuestionRequest;
use App\Http\Requests\EditQuestionRequest;
use App\Http\Requests\GenerateQuestionRequest;
use App\Http\Resources\CourseResource;
use App\Http\Resources\QuestionResource;
use App\Jobs\GenerateQuestionJob;
use App\Jobs\ProcessQuestionsJob;
use App\Models\Course;
use App\Models\Question;
use App\Models\QuestionJob;
use App\Services\FastApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuestionController extends Controller
{
    protected $fastAPIService;
    public function __construct(FastApiService $fastAPIService)
    {
        $this->fastAPIService = $fastAPIService;
    }
    public function index()
    {
        //
        $query = Question::query()
            ->with('course')
            ->withCount('assessment_items')
            ->withCount([
                'assessment_items as correct_count' => function ($query) {
                    $query->where('score', '>', 0);
                },
                'assessment_items as incorrect_count' => function ($query) {
                    $query->where('score', '=', 0);
                },
            ]);

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

            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(question) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(answer) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        if ($courseTitle = request('course')) {
            $query->whereHas('course', function ($q) use ($courseTitle) {
                $q->where('title', 'like', '%' . $courseTitle . '%');
            });
        }

        if ($difficulty = request('difficulty')) {
            $query->where('difficulty_type', $difficulty);
        }
        if ($question_type = request('question_type')) {
            $query->where('question_type', $question_type);
        }
        if (!empty($sortField) && !empty($sortDirection)) {
            if ($sortField === 'total_count') {
                $query->orderBy('assessment_items_count', $sortDirection);
            } else {
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

        // Add all filters to the filters array
        $filters = [
            'courses' => $title,
            'difficulty' => $difficulty,
            'question_type' => $questionTypes,
        ];

        return Inertia::render('Admin/Questions/Question', [
            'title' => 'Admin Question',
            'questions' => QuestionResource::collection($questions),
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function generate(GenerateQuestionRequest $request)
    {
        $validatedData = $request->validated();
        $jobs = collect();

        foreach ($request->all() as $data) {
            $job_id = QuestionJob::insertGetId([
                'course_id' => $data['course_id'],
                'total_very_easy' => $data['difficulty']['numOfVeryEasy'],
                'total_easy' => $data['difficulty']['numOfEasy'],
                'total_average' => $data['difficulty']['numOfAverage'],
                'total_hard' => $data['difficulty']['numOfHard'],
                'total_very_hard' => $data['difficulty']['numOfVeryHard'],
                'total_questions' => array_sum($data['difficulty']),
                'status' => JobStatus::PENDING->value,
                'generated_by' => Auth::user()->userable->firstname . ', ' . Auth::user()->userable->lastname,
            ]);

            // Store the data with the job ID included
            $jobs->push([
                'course_id' => $data['course_id'],
                'course_title' => $data['course_title'] ?? 'Unknown',
                'question_job_id' => $job_id,
                'difficulty' => $data['difficulty'],
            ]);
        }

        GenerateQuestionJob::dispatch($jobs->toArray());
        return redirect()->back()->with('message', 'Generating questions based on the selected courses.');
    }


    public function show()
    {
        $courses = Course::with('modules')->get();
        $difficulty = array_map(fn($case) => $case->value, QuestionDifficulty::cases());
        return Inertia::render('Admin/Questions/Generate', [
            'title' => 'Admin Question',
            'courses' => CourseResource::collection($courses),
            'difficulty' => $difficulty,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EditQuestionRequest $request, Question $question)
    {
        $validated = $request->validated();

        $course = Course::where('title', $validated['course_title'])->first();
        if (!$course) {
            return redirect()->back()->withErrors('Course not found');
        }
        // Update course if changed
        if ($question->course->course_id !== $course->course_id) {
            $question->course_id = $course->course_id;
        }

        if (!is_array($validated['answer'])) {
            $validated['answer'] = json_encode([$validated['answer']]);
        } else {
            $validated['answer'] = json_encode($validated['answer']);
        }

        $validated['choices'] = !empty($validated['choices']) ? json_encode($validated['choices']) : null;
        unset($validated['course_title']);
        $question->update($validated);

        return redirect()->back()->with('success', 'Successfully updated');
    }

    public function delete(Question $question)
    {
        $question->delete();
        return redirect()->back()->with('success', 'Deleted Successfully');
    }
    public function courses()
    {
        $courses = Course::with([
            'question_jobs' => function ($query) {
                $query->status('pending');
            },
            'modules' => function ($query) {
                $query->where('vectorized', true);
            }
        ])->get();
        
        $difficulty = array_map(fn($case) => $case->value, QuestionDifficulty::cases());
        $questionTypes = collect(QuestionType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();
        return response()->json(['courses' => $courses, 'difficulty' => $difficulty, 'question_type' => $questionTypes]);
    }
    public function store(Request $request)
    {
        $data = $request->json()->all();
        // Dispatch the job
        ProcessQuestionsJob::dispatch($data);
        return redirect()->back()->with('success', 'Deleted Successfully');
    }

    public function bulkDelete(BulkQuestionRequest $request)
    {
        $validated = $request->validated();
        $questionIds = $validated['questions'];

        // Call FastAPI once with all IDs
        $questionUids = Question::whereIn('question_id', $questionIds)->pluck('question_uid');
        $response = $this->fastAPIService->bulkDeleteQuestions($questionUids->toArray());
        if ($response->failed()) {
            return redirect()->back()->withErrors('FastAPI bulk delete failed.');
        }

        Question::whereIn('question_id', $questionIds)->delete();

        $query = request()->query();
        $query['page'] = 1;

        return redirect()->route('admin.question.index', $query)
            ->with('success', 'Deleted Successfully');
    }


}
