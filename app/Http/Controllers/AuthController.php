<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //
    
    public function logout(Request $request)
    {
        $user = Auth::user();

        if ($user && $user->userable_type === 'App\Models\Admin') {
            $user->userable->update(['last_login' => Carbon::now()]);
            $redirectRoute = 'admin.showLogin';
        } else {
            $redirectRoute = 'login';
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route($redirectRoute);
    }
}
