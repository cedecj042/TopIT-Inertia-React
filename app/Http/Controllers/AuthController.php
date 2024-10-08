<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //
    
    public function logout(Request $request)
    {
        $user = Auth::user();

        if ($user && $user->userable_type === 'App\Models\Admin') {
            $redirectRoute = 'admin.login';
        } else {
            $redirectRoute = 'login';
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route($redirectRoute);
    }
}
