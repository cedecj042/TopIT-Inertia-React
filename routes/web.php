<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AssessmentController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\FastApiController;
use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\PdfController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\RecalibrationController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PretestController as AdminPretestController;
use App\Http\Controllers\Student\PretestController as StudentPretestController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\StudentCourseController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\StudentProfileController;
use App\Http\Controllers\Student\TestController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Prompts\Concerns\Fallback;


Route::middleware('guest')->group(function () {
    Route::get('/login', [StudentController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [StudentController::class, 'loginStudent'])->name('student.login');
    Route::get('/register', [StudentController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [StudentController::class, 'registerStudent'])->name('student.register');
    Route::get('/admin/login', [AdminController::class, 'showLoginForm'])->name('admin.showLogin');
    Route::post('/admin/login', [AdminController::class, 'loginAdmin'])->name('admin.login');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

Route::middleware(['auth', 'student'])->group(function () {
    Route::get('/welcome', [StudentPretestController::class, 'welcome'])->name('welcome');
    Route::middleware(['pretest.completed', 'test.no_pending'])->group(function () {
        Route::redirect('', '/dashboard');
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/profile', [StudentProfileController::class, 'showStudentDetails'])->name('profile');
        Route::post('/profile', [StudentProfileController::class, 'editProfile'])->name('profile.edit');

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

            Route::get('/review/{assessment}', [TestController::class, 'review'])->name('review');
        });
    });
    Route::get('/test/{assessment}', [TestController::class, 'show'])->name('test.show');
    Route::put('/test/{assessment_item}/submit', [TestController::class, 'submit'])->name('test.submit');
    Route::get('/finish/{assessment}', [TestController::class, 'finish'])->name('test.finish');

    Route::middleware('pretest.not_taken')->group(function () {
        Route::get('/start', [StudentPretestController::class, 'startPretest'])->name('pretest.start');
        Route::put('/submit/{assessment}', [StudentPretestController::class, 'submit'])->name('pretest.submit');
    });

});

// Admin
Route::post('/admin/store-processed-pdf', [FastApiController::class, 'storeProcessedPdf'])->name('store-pdf');
Route::post('/admin/store-questions', [FastApiController::class, 'storeProcessedQuestion'])->name('store-questions');
Route::post('/admin/update-module-status', [FastApiController::class, 'updateModuleStatus'])->name('update-module-status');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

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
        Route::put('/update/{question}', [QuestionController::class, 'update'])->name('update');
        Route::delete('/delete/{question}', [QuestionController::class, 'delete'])->name('delete');
        Route::get('/generate/show', [QuestionController::class, 'show'])->name('show');
        Route::post('/generate', [QuestionController::class, 'generate'])->name('generate');
        Route::get('/courses', [QuestionController::class, 'courses'])->name('courses');
        Route::post('/bulkDelete', [QuestionController::class,'bulkDelete'])->name('bulkDelete');
    });
    Route::prefix('recalibration')->name('recalibration.')->group(function(){
        Route::get('/',[RecalibrationController::class,'index'])->name('index');
        Route::get('/show/{id}',[RecalibrationController::class,'show'])->name('logs');
        Route::post('/recalibrate',[RecalibrationController::class,'recalibrate'])->name('recalibrate');
    });
    Route::prefix('assessments')->name('assessments.')->group(function(){
        Route::get('/',[AssessmentController::class,'index'])->name('index');
        Route::get('/{assessment}',[AssessmentController::class,'show'])->name('show');
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

    Route::get('/report', [ReportController::class, 'index'])->name('report');
    // Route::get('/profile', [AdminController::class, 'profile'])->name('profile');
    Route::post('/profile/update', [AdminController::class, 'update'])->name('profile.update');
    Route::get('/student/{id}', [ReportController::class, 'student'])->name('student');

});

Route::fallback(function () {
    return Inertia::render('Error', [
        'title' => 'Page not Found',
        'auth' => Auth::check() ? Auth::user() : null,
    ]);
});
