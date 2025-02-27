<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\FastApiController;
use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\PdfController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\ReportController;
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
        // Route::middleware(['auth', 'pretest.not_taken'])->group(function () { //users who already completed the pretest cannot revisit the pretest pages
        Route::get('/start', [StudentPretestController::class, 'startPretest'])->name('start');
        Route::post('/submit', [StudentPretestController::class, 'submit'])->name('submit');
        // });
        Route::get('/finish/{assessmentId}', [StudentPretestController::class, 'finish'])->name('finish');
        Route::get('/review/{assessmentId}', [StudentPretestController::class, 'review'])->name('review');
    });

    Route::middleware(['auth', 'student', 'pretest.completed'])->group(function () { //registered users cannot proceed to dashboard if pretest not completed
        Route::redirect('', '/dashboard');
        Route::redirect('/', '/dashboard');
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/profile', [StudentProfileController::class, 'showStudentDetails'])->name('profile');
        Route::post('/profile', [StudentProfileController::class, 'editProfile'])->name('student.profile.edit');

        Route::prefix('course')->name('course.')->group(function () {
            Route::get('/', [StudentCourseController::class, 'index'])->name(name: 'index');
            Route::get('/{id}', [StudentCourseController::class, 'show'])->name('show');
            Route::get('/module/{id}', [StudentCourseController::class, 'module'])->name('module');
        });

        Route::prefix('test')->name('test.')->group(function () {
            Route::get('/', [TestController::class, 'index'])->name('index');
            Route::get('/history', [TestController::class, 'history'])->name('history');

            Route::get('/course', [TestController::class, 'select'])->name('course');
            Route::post('/start', [TestController::class, 'start'])->name('start');
            Route::get('/{assessmentId}', [TestController::class, 'show'])->name('page');
            Route::post('/next-question', [TestController::class, 'nextQuestion'])->name('next-question');

            Route::get('/finish/{assessmentId}', [TestController::class, 'finish'])->name('finish');
            Route::get('/review/{assessmentId}', [TestController::class, 'review'])->name('review');
        });
    });



});

// Admin
Route::post('/admin/store-processed-pdf', [FastApiController::class, 'storeProcessedPdf'])->name('store-pdf');
Route::post('/admin/store-questions', [FastApiController::class, 'storeProcessedQuestion'])->name('store-questions');
Route::post('/admin/update-module-status', [FastApiController::class, 'updateModuleStatus'])->name('update-module-status');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/dashboard');
    Route::redirect('', '/admin/dashboard');
    Route::redirect('/admin', '/admin/dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Courses
    Route::prefix('course')->name('course.')->group(function () {
        Route::get('/', [CourseController::class, 'index'])->name('index');
        Route::post('/add', [CourseController::class, 'add'])->name('add');
        Route::get('/{id}', [CourseController::class, 'show'])->name('detail');
        Route::put('/update/{id}', [CourseController::class, 'update'])->name('update');
        Route::delete('/delete/{id}', [CourseController::class, 'delete'])->name('delete');
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
        Route::delete('module/{id}', [ModuleController::class, 'delete'])->name('delete');
        Route::delete('module/{type}/{id}', [ModuleController::class, 'destroyContent'])->name('content.destroy');

        // Route::delete('/delete/module/{id}', [ModuleController::class, 'deleteModule'])->name('delete');
        // Route::delete('/delete/lesson/{id}', [ModuleController::class, 'deleteLesson'])->name('delete.lesson');
        // Route::delete('/delete/section/{id}', [ModuleController::class, 'deleteSection'])->name('delete.section');
        // Route::delete('/delete/subsection/{id}', [ModuleController::class, 'deleteSubsection'])->name('delete.subsection');

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

    Route::prefix('pretest')->name('pretest.')->group(function () {
        Route::get('/', [AdminPretestController::class, 'index'])->name('index');
        Route::get('/add', [AdminPretestController::class, 'show'])->name('add');
        Route::post('/add', [AdminPretestController::class, 'add'])->name('add');

    });
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [AdminUserController::class, 'index'])->name('index');
        Route::post('/create', [AdminUserController::class, 'create'])->name('create');
        Route::delete('/{id}', [AdminUserController::class, 'delete'])->name('delete');

    });
    
    Route::get('/report',[ReportController::class,'index'])->name('report');
    // Route::get('/profile', [AdminController::class, 'profile'])->name('profile');
    Route::post('/profile/update',[AdminController::class,'update'])->name('profile.update');
    Route::get('/student/{id}', [ReportController::class, 'student'])->name('student');
});

Route::get('/access-denied', [ErrorController::class, 'index'])->name('access.denied');
