<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Auth/Student/StudentLogin');
    }

    public function loginStudent(){
        
    }
}
