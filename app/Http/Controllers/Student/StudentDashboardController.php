<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Enums\AssessmentStatus;
use App\Http\Resources\AssessmentResource;
use App\Models\StudentCourseTheta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Test;
use App\Http\Resources\TestResource;
use App\Models\Assessment;

class StudentDashboardController extends Controller
{
    public function index()
    {

        $studentId = Auth::user()->userable->student_id;

        $allAssessments = Assessment::where('student_id', $studentId)
            ->where('status', AssessmentStatus::COMPLETED->value)
            ->orderBy('created_at', 'asc')  
            ->orderBy('assessment_id', 'asc')
            ->get(['assessment_id', 'created_at']);

        $sequenceMap = [];
        foreach ($allAssessments as $index => $assessment) {
            $sequenceMap[$assessment->assessment_id] = $index + 1;
        }

        $tests = Assessment::with(['assessment_courses.course'])
            ->where('student_id', $studentId)
            ->orderBy('created_at', 'desc')  
            ->orderBy('assessment_id', 'desc')
            ->take(3)
            ->get()
            ->map(function ($test) use ($sequenceMap) {
                $test->sequence_number = $sequenceMap[$test->assessment_id] ?? 'N/A';
                return $test;
            });
            
        // Fetch StudentCourseTheta data with courses
        $coursesTheta = StudentCourseTheta::where('student_id', $studentId)
            ->with('course')
            ->get();

        // Prepare data for the ThetaScoreLine component
        $thetaScoreData = [
            'labels' => $coursesTheta->pluck('course.title')->toArray(),
            'data' => $coursesTheta->pluck('theta_score')->toArray(),
        ];

        $courseCards = $coursesTheta->map(function ($courseTheta) {
            return [
                'course_id' => $courseTheta->course_id,
                'title' => $courseTheta->course->title,
                'theta_score' => $courseTheta->theta_score,
            ];
        });


        return Inertia::render('Student/Dashboard', [
            'title' => 'Student Dashboard',
            'thetaScore' => $thetaScoreData,
            'tests' => AssessmentResource::collection($tests),
            'courseCards' => $courseCards
        ]);
    }
}
