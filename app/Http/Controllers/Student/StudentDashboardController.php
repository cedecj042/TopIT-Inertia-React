<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
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

        // Fetch StudentCourseTheta data with courses
        $coursesTheta = StudentCourseTheta::where('student_id', $studentId)
            ->with('course') // Eager load the course relationship
            ->get();

        // Prepare data for the ThetaScoreLine component
        $thetaScoreData = [
            'labels' => $coursesTheta->pluck('course.title')->toArray(), // Get course titles
            'data' => $coursesTheta->pluck('theta_score')->toArray(), // Get theta scores
        ];

        // Get 3 recent test history
        $tests = Assessment::where('student_id', $studentId)
            ->orderBy('updated_at', 'desc')
            ->take(3)
            ->get();

        $courseCards = $coursesTheta->map(function ($courseTheta) {
            return [
                'course_id' => $courseTheta->course_id,
                'title' => $courseTheta->course->title,
                'theta_score' => $courseTheta->theta_score,
            ];
        });


        return Inertia::render('Student/Dashboard', [
            'title' => 'Student Dashboard',
            // 'auth' => $studentId, removed since navbar wont display if naa ni
            'thetaScore' => $thetaScoreData,
            'tests' => AssessmentResource::collection($tests),
            'courseCards' => $courseCards
        ]);
    }
}
