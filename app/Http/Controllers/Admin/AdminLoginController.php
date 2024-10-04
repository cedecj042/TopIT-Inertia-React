<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLoginController extends Controller
{
    //
    public function showLoginForm()
    {
        return Inertia::render('Auth/Admin/AdminLogin');
    }
}
