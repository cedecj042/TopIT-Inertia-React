<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AssessmentStatus;
use App\Enums\ItemStatus;
use App\Enums\QuestionDifficulty;
use App\Enums\TestType;
use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\AssessmentTypeResource;
use App\Models\Assessment;
use App\Models\AssessmentType;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    public function index()
    {
        $query = Assessment::with(['assessment_courses.course', 'assessment_courses.assessment_items.question', 'assessment_courses.theta_score_logs','student','assessment_type'])
            ->where('status', AssessmentStatus::COMPLETED->value);

        if ($courseTitle = request('course')) {
            $query->whereHas('assessment_courses.course', function ($q) use ($courseTitle) {
                $q->where('title', 'like', '%' . $courseTitle . '%');
            });
        }

        // Filter by date range
        if ($fromDate = request('from')) {
            $query->whereDate('created_at', '>=', $fromDate);
        }

        if ($toDate = request('to')) {
            $query->whereDate('created_at', '<=', $toDate);
        }
        if ($type = request('type')) {
            $query->testType($type);
        }
        if ($status = request('status')) {
            $query->where('status', $status);
        }
        if (request('school') || request('year')) {
            $school = request('school');
            $year = request('year');
            $query->whereHas('student', function ($q) use ($school, $year) {
                $q->when($school, function ($q) use ($school) {
                    $q->where('school', $school);
                })->when($year, function ($q) use ($year) {
                    $q->where('year', $year);
                });
            });
        }

        $sort = request()->query('sort', ''); // Empty by default
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
            $query->orderBy('created_at', 'desc');
        }


        $perPage = request('items', 5);
        $assessments = $query->paginate($perPage)->onEachSide(1);


        $title = Course::distinct()->pluck('title');
        $testTypes = collect(TestType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();
        $statusTypes = collect(ItemStatus::cases())->map(function ($case) {
            return $case->value;
        })->toArray();

        $schools = Student::distinct()->pluck('school');
        $years = Student::distinct()->orderBy('year', 'asc')->pluck('year');

        $filters = [
            'course' => $title,
            'test_types' => $testTypes,
            'status' => $statusTypes,
            'school' => $schools,
            'year' => $years,
        ];

        $assessment_types = AssessmentType::all();
        $difficultyCount = count(QuestionDifficulty::cases());

        return Inertia::render('Admin/Assessment/Assessments', [
            'title' => 'Assessments',
            'tests' => AssessmentResource::collection($assessments),
            'types' => AssessmentTypeResource::collection($assessment_types),
            'difficultyCount'=> $difficultyCount,
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
    }
    public function show(Assessment $assessment)
    {
        $assessment->load(['assessment_courses.course', 'assessment_courses.assessment_items.question']);

        return Inertia::render('Admin/Assessment/Details', [
            'title' => 'Assessment Details',
            'assessment' => new AssessmentResource($assessment),
        ]);
    }
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'types' => 'required|array',
            'types.*.type_id' => 'required|integer',
            'types.*.type' => 'required|string|max:255',
            'types.*.total_questions' => 'required|integer|min:0',
            'types.*.evenly_distributed' => 'required|boolean',
        ]);
        $difficultyCount = count(QuestionDifficulty::cases());
        foreach ($validated['types'] as $index => $type) {
            if (
                $type['evenly_distributed'] &&
                $type['total_questions'] % $difficultyCount !== 0
            ) {
                return redirect()->back()->withErrors([
                    "types.$index.total_questions" => "Total questions for '{$type['type']}' must be divisible by $difficultyCount when evenly distributed is enabled.",
                ])->withInput();
            }
        }
        AssessmentType::upsert(
            $validated['types'],
            ['type_id', 'type'], // unique key columns
            ['total_questions', 'evenly_distributed', 'updated_at'] // columns to update
        );

        return redirect()->back()->with(['message' => 'Assessment types updated successfully.']);
    }

}
