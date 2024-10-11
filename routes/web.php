<?php

use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\StudentCourseController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\StudentLoginController;
use App\Http\Controllers\Student\StudentProfileController;
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
    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
});

Route::middleware(['student', 'auth'])->group(function () {
    Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [StudentProfileController::class, 'index'])->name('profile');

    Route::get('/course', [StudentCourseController::class, 'showStudentCourse'])->name('student-course');
    Route::get('/course/{id}', [StudentCourseController::class, 'showStudentCourseDetail'])->name('student-course-detail');
    Route::get('/course/module/{id}', [StudentCourseController::class, 'showModuleDetail'])->name('student-module-detail');
});


Route::middleware(['admin', 'auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Courses
    Route::prefix('course')->name('course.')->group(function () {
        Route::get('/', [CourseController::class, 'index'])->name('index');
        // Route::post('/add', [CourseController::class, 'addCourse'])->name('add');
        Route::get('/{course_id}', [CourseController::class, 'show'])->name('detail');
        // Route::post('/pdf/upload', [PdfController::class, 'uploadPdf'])->name('pdf.upload');
        // Route::delete('/pdf/delete/{id}', [PdfController::class, 'deletePdf'])->name('pdf.delete');
    });

    Route::get('/profile', [DashboardController::class, 'showProfile'])->name('profile');
    Route::get('/student/{student_id}', [DashboardController::class, 'showStudentDetails'])->name('student');
});
