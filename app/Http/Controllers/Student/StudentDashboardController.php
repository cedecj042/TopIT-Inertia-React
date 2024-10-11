<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Test;
use App\Http\Resources\TestResource;

class StudentDashboardController extends Controller
{
    public function index(){

        $studentId= Auth::user()->userable->student_id;

        $averageThetaScore = DB::table('test_courses')
        ->select('courses.title as course_title', DB::raw('AVG(test_courses.theta_score) as avg_theta_score'))
        ->join('tests', 'test_courses.test_id', '=', 'tests.test_id')
        ->join('students', 'tests.student_id', '=', 'students.student_id')
        ->join('courses', 'test_courses.course_id', '=', 'courses.course_id')
        ->where('students.student_id', $studentId)
        ->groupBy('courses.title')
        ->get();

        $averageTheta = [
            'labels' => $averageThetaScore->pluck('course_title')->toArray(),
            'data' => $averageThetaScore->pluck('avg_theta_score')->toArray()
        ];

        $tests = Test::where('student_id', $studentId)->get();


        return Inertia::render('Student/Dashboard',[
            'title' => 'Student Dashboard',
            'averageThetaScore' => $averageTheta,
            'tests' => TestResource::collection($tests),
        ]);

    }
}
