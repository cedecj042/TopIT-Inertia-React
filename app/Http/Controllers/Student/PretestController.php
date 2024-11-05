<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Course;
use App\Models\Student;

use App\Http\Resources\StudentResource;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PretestController extends Controller
{
    // PretestController.php remains the same
public function welcome() {
    $student = Student::find(Auth::user()->userable->student_id);
    return Inertia::render('Student/Pretest/Welcome', [
        'student' => new StudentResource($student),
        'title' => "Welcome"
    ]);
}

    public function startPretest()
    {
        Session::forget('pretest_progress');
        Session::forget('pretest_answers');

        $courses = Course::all();

        $pretestProgress = [
            'current_course_index' => 0,
            'courses' => $courses->pluck('course_id')->toArray(),
        ];

        Session::put('pretest_progress', $pretestProgress);

        return Inertia::location(route('pretest.questions'));
    }
}