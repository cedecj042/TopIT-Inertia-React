<?php

use App\Events\UploadEvent;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\PdfController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\ErrorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\StudentCourseController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\StudentLoginController;
use App\Http\Controllers\Student\StudentProfileController;
use App\Http\Controllers\Student\PretestController;
use App\Http\Controllers\Student\TestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


Route::middleware('guest')->group(function () {
    Route::get('/login', [StudentController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [StudentController::class, 'loginStudent'])->name('student.login');
    Route::get('/register', [StudentController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [StudentController::class, 'registerStudent'])->name('student.register');
    Route::get('/admin/login', [AdminController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/admin/login', [AdminController::class, 'loginAdmin'])->name('admin.login');
    Route::get('/admin/login', [AdminController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/admin/login', [AdminController::class, 'loginAdmin'])->name('admin.login');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

Route::middleware(['auth','student'])->group(function () {
    Route::redirect('','/dashboard');
    Route::redirect('/','/dashboard');
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

    Route::get('/test', [TestController::class,'index'] )->name('test');

});


Route::middleware(['auth','admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/dashboard');
    Route::redirect('','/admin/dashboard');
    Route::redirect('/admin','/admin/dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Courses
    Route::prefix('course')->name('course.')->group(function () {
        Route::get('/', [CourseController::class, 'index'])->name('index');
        Route::post('/add', [CourseController::class, 'add'])->name('add');
        Route::get('/{course_id}', [CourseController::class, 'show'])->name('detail');
        Route::delete('/delete/{course_id}', [CourseController::class, 'delete'])->name('delete');
        Route::post('/pdf/upload', [PdfController::class, 'process'])->name('pdf.upload');
        // Route::delete('/pdf/delete/{id}', [PdfController::class, 'deletePdf'])->name('pdf.delete');
    });

    Route::get('/profile', [DashboardController::class, 'showProfile'])->name('profile');
    Route::get('/student/{student_id}', [DashboardController::class, 'showStudentDetails'])->name('student');
});

Route::get('/access-denied',[ErrorController::class,'index'])->name('access.denied');
