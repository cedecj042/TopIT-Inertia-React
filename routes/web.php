<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\PdfController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PretestController as AdminPretestController;
use App\Http\Controllers\Student\PretestController as StudentPretestController;
use App\Http\Controllers\Admin\ProcessedPdfController;
use App\Http\Controllers\ErrorController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\StudentCourseController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\StudentProfileController;
use App\Http\Controllers\Student\TestController;
use Illuminate\Support\Facades\Route;


Route::middleware('guest')->group(function () {
    Route::get('/login', [StudentController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [StudentController::class, 'loginStudent'])->name('student.login');
    Route::get('/register', [StudentController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [StudentController::class, 'registerStudent'])->name('student.register');
    Route::get('/admin/login', [AdminController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/admin/login', [AdminController::class, 'loginAdmin'])->name('admin.login');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});



Route::middleware(['auth', 'student'])->group(function () {
    Route::redirect('/', '/dashboard');
    Route::get('/welcome', [StudentPretestController::class, 'welcome'])->name('welcome');

    Route::prefix('pretest')->name('pretest.')->group(function () {
        Route::middleware(['auth', 'pretest.not_taken'])->group(function () {
            Route::get('/start', [StudentPretestController::class, 'startPretest'])->name('start');
            Route::post('/submit', [StudentPretestController::class, 'submit'])->name('submit');
        });
        Route::get('/finish/{assessmentId}', [StudentPretestController::class, 'finish'])->name('finish');
        Route::get('/review/{assessmentId}', [StudentPretestController::class, 'review'])->name('review');
    });


    Route::redirect('', '/dashboard');
    Route::redirect('/', '/dashboard');
    Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [StudentProfileController::class, 'showStudentDetails'])->name('profile');
    Route::put('/profile', [StudentProfileController::class, 'editProfile'])->name('student.profile.edit');

    Route::get('/course', [StudentCourseController::class, 'showStudentCourse'])->name('student-course');
    Route::get('/course/{id}', [StudentCourseController::class, 'showStudentCourseDetail'])->name('student-course-detail');
    Route::get('/course/module/{id}', [StudentCourseController::class, 'showModuleDetail'])->name('student-module-detail');

    Route::get('/test', [TestController::class, 'index'])->name('test');
    Route::get('/test/history', [TestController::class, 'testHistory'])->name('test.history');


    Route::get('/test/modules', [TestController::class, 'selectModules'])->name('test.modules');
    // Route::get('/test/{assessmentId}/start', [StudentCourseController::class, 'startTest'])->name('assessment.start');


});

// Admin
Route::post('/admin/store-processed-pdf', [ProcessedPdfController::class, 'store'])->name('store-pdf');
Route::post('/admin/store-questions', [QuestionController::class, 'store'])->name('store-questions');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/dashboard');
    Route::redirect('', '/admin/dashboard');
    Route::redirect('/admin', '/admin/dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Courses
    Route::prefix('course')->name('course.')->group(function () {
        Route::get('/', [CourseController::class, 'index'])->name('index');
        Route::post('/add', [CourseController::class, 'add'])->name('add');
        Route::get('/{course_id}', [CourseController::class, 'show'])->name('detail');
        Route::delete('/delete/{course_id}', [CourseController::class, 'delete'])->name('delete');
        Route::post('/pdf/upload', [PdfController::class, 'store'])->name('pdf.upload');
        Route::delete('/pdf/delete/{id}', [PdfController::class, 'delete'])->name('pdf.delete');
    });

    Route::prefix('module')->name('module.')->group(function () {
        Route::get('/vector', [ModuleController::class, 'courses'])->name('courses');
        Route::post('/vectorize', [ModuleController::class, 'vectorize'])->name('vectorize');

        Route::get('/', [ModuleController::class, 'index'])->name('index');
        Route::get('/{id}', [ModuleController::class, 'show'])->name('detail');
        Route::get('/edit/{id}', [ModuleController::class, 'edit'])->name('edit');
        Route::put('/update/{id}', [ModuleController::class, 'update'])->name('update');
        Route::delete('/delete/module/{id}', [ModuleController::class, 'deleteModule'])->name('delete');
        Route::delete('/delete/lesson/{id}', [ModuleController::class, 'deleteLesson'])->name('delete.lesson');
        Route::delete('/delete/section/{id}', [ModuleController::class, 'deleteSection'])->name('delete.section');
        Route::delete('/delete/subsection/{id}', [ModuleController::class, 'deleteSubsection'])->name('delete.subsection');

    });
    Route::prefix('content')->name('content.')->group(function () {
        Route::put('/update/{id}', [ContentController::class, 'update'])->name('update');
        Route::post('/add', [ContentController::class, 'create'])->name('create');
        Route::delete('/delete/{id}', [ContentController::class, 'destroy'])->name('delete');

    });
    Route::prefix('question')->name('question.')->group(function () {
        Route::get('/', [QuestionController::class, 'index'])->name('index');
        Route::put('/update/{id}', [QuestionController::class, 'update'])->name('update');
        Route::delete('/delete/{id}', [QuestionController::class, 'delete'])->name('delete');
        Route::get('/generate/show', [QuestionController::class, 'show'])->name('show');
        Route::post('/generate', [QuestionController::class, 'generate'])->name('generate');
        Route::get('/courses', [QuestionController::class, 'courses'])->name('courses');
    });

    Route::prefix('pretest')->name('pretest.')->group(function(){
        Route::get('/',[AdminPretestController::class,'index'])->name('index');
        Route::get('/add',[AdminPretestController::class,'show'])->name('add');
        Route::post('/add',[AdminPretestController::class,'add'])->name('add');
        
    });
    Route::prefix('users')->name('users.')->group(function (){
        Route::get('/',[AdminUserController::class,'index'])->name('index');
        Route::post('/create',[AdminUserController::class,'create'])->name('create');
        Route::delete('/{id}', [AdminUserController::class, 'delete'])->name('delete');

    });
    

    Route::get('/profile', [DashboardController::class, 'showProfile'])->name('profile');
    Route::get('/student/{student_id}', [DashboardController::class, 'showStudentDetails'])->name('student');
});

Route::get('/access-denied', [ErrorController::class, 'index'])->name('access.denied');
