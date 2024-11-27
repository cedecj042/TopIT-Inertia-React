<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentResource;
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

        $averageThetaScore = DB::table('assessment_courses')
            ->select('courses.title as course_title', DB::raw('AVG(assessment_courses.final_theta_score) as avg_theta_score'))
            ->join('assessments', 'assessment_courses.assessment_id', '=', 'assessments.assessment_id')
            ->join('students', 'assessments.student_id', '=', 'students.student_id')
            ->join('courses', 'assessment_courses.course_id', '=', 'courses.course_id')
            ->where('students.student_id', $studentId)
            ->where('assessments.type', 'Test')  // Filter only "Test" assessments
            ->groupBy('courses.title')
            ->get();

        $averageTheta = [
            'labels' => $averageThetaScore->pluck('course_title')->toArray(),
            'data' => $averageThetaScore->pluck('avg_theta_score')->toArray()
        ];

        // Get 3 recent test history
        $tests = Assessment::where('student_id', $studentId)
            ->orderBy('updated_at', 'desc')
            ->take(3)
            ->get();


        return Inertia::render('Student/Dashboard', [
            'title' => 'Student Dashboard',
            'averageThetaScore' => $averageTheta,
            'tests' => AssessmentResource::collection($tests),
        ]);
    }
}
