<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ErrorController extends Controller
{
    //
    public function index(){
        return Inertia::render('Error',[
            'title' => 'Page not Found',
            'auth'=> Auth::user(),
        ]);
    }
}
