<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\StudentLoginController;
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
    Route::get('/admin/login', [AdminController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/admin/login', [AdminController::class, 'loginAdmin'])->name('admin.login');
});

Route::middleware(['student', 'auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Auth/Student/Dashboard');
    });
});


Route::middleware(['admin', 'auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class,'index'])->name('dashboard');

    Route::get('/profile',[AdminController::class,'showProfile'])->name('profile');
    Route::get('/student/profile/{student_id}',[AdminController::class,'showStudentProfile'])->name('student.profile');
});

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// require __DIR__.'/auth.php';
