<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    //

    public function index(){
        
        $thetaScores = DB::table('student_course_thetas')
            ->join('courses', 'student_course_thetas.course_id', '=', 'courses.course_id')
            ->select(
                'courses.title as course_title', // Get the course title
                'student_course_thetas.course_id',
                DB::raw('MAX(student_course_thetas.theta_score) as high_score'), // Get the high score
                DB::raw('MIN(student_course_thetas.theta_score) as low_score')   // Get the low score
            )
            ->groupBy('student_course_thetas.course_id', 'courses.title')
            ->get();

        $formattedThetaScores = [
            'labels' => $thetaScores->pluck('course_title')->toArray(), 
            'high' => $thetaScores->pluck('high_score')->toArray(), 
            'low' => $thetaScores->pluck('low_score')->toArray(),   
        ];

        return Inertia::render('Admin/Reports',[
            'title' => 'Admin Reports',
            'auth' => Auth::user(),
            'highlowData' => $formattedThetaScores,

        ]);
    }
}
