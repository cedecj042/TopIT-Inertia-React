<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AssessmentStatus;
use App\Enums\ItemStatus;
use App\Enums\TestType;
use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentResource;
use App\Models\Assessment;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    public function index()
    {
        $query = Assessment::with(['assessment_courses.course', 'assessment_courses.assessment_items.question', 'assessment_courses.theta_score_logs'])		
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
        if ($testType = request('test_types')) {
            $query->where('type', $testType);
        }
        if ($status = request('status')) {
            $query->where('status', $status);
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
        $statusTypes = collect(ItemStatus::cases())->map(function ($case){
            return $case->value;
        })->toArray();


        $filters = [
            'course' => $title,
            'test_types' => $testTypes,
            'status'=>$statusTypes,
        ];

        return Inertia::render('Admin/Assessment/Assessments', [
            'title' => 'Assessment Histories',
            'tests' => AssessmentResource::collection($assessments),
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
    }
    public function show(Assessment $assessment){
        $assessment->load(['assessment_courses.course', 'assessment_courses.assessment_items.question']);
        
        return Inertia::render('Admin/Assessment/Details', [
            'title' => 'Assessment Details',
            'assessment' => new AssessmentResource($assessment),
        ]);
    }
}
