<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\StudentCourseController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\StudentLoginController;
use App\Http\Controllers\Student\StudentProfileController;
use App\Http\Controllers\Student\PretestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::redirect('/','/dashboard');

Route::middleware('guest')->group(function () {
    Route::get('/login', [StudentController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [StudentController::class, 'loginStudent'])->name('student.login');
    Route::get('/register', [StudentController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [StudentController::class, 'registerStudent'])->name('student.register');
    Route::get('/admin/login', [AdminController::class, 'showLoginForm'])->name('admin.loginform');
    Route::post('/admin/login', [AdminController::class, 'loginAdmin'])->name('admin.login');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    // Route::get('/logout', [AuthController::class, 'logout'])->name(name: 'logout');
});

Route::middleware(['student', 'auth'])->group(function () {
    Route::get('/welcome',[PretestController::class,'welcome'] )->name('welcome');
    Route::prefix('pretest')->name('pretest.')->group(function () {
        Route::get('/start', [PretestController::class, 'startPretest'])->name('start');
        Route::get('/questions/{courseIndex?}', [PretestController::class, 'showQuestions'])->name('questions');
        
        Route::post('/submit', [PretestController::class, 'submitAnswers'])->name('submit');
        Route::get('/finish/{pretestId}', [PretestController::class, 'showFinishAttempt'])->name('finish');
        Route::get('/review/{pretestId}', [PretestController::class, 'reviewPretest'])->name('review');
    });

    Route::get('/dashboard',[StudentDashboardController::class,'index'])->name('dashboard');
    Route::get('/profile',[StudentProfileController::class,'index'] )->name('profile');
    
    Route::get('/course', [StudentCourseController::class, 'showStudentCourse'])->name('student-course');
    Route::get('/course/{id}', [StudentCourseController::class, 'showStudentCourseDetail'])->name('student-course-detail');
    Route::get('/course/module/{id}', [StudentCourseController::class, 'showModuleDetail'])->name('student-module-detail');
});


Route::middleware(['admin', 'auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [DashboardController::class, 'showProfile'])->name('profile');
    Route::get('/student/{student_id}', [DashboardController::class, 'showStudentDetails'])->name('student');
});


