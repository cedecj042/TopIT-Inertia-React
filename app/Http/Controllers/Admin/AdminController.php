<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;


class AdminController extends Controller
{
    //
    public function showLoginForm()
    {
        return Inertia::render('Auth/AdminLogin');
    }
    public function loginAdmin(LoginRequest $request)
    {
        Log::info('Logging in admin',$request->query());
        $validated = $request->validated();

        if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
            $user = Auth::user();
            $request->session()->regenerate();
            Log::info('User authenticated successfully.', ['user_id' => $user->user_id]);

            if ($user->userable_type === 'App\Models\Admin') {
                Log::info('Authenticated user is an Admin.', ['user_id' => $user->user_id]);
                return redirect()->route('admin.dashboard')->with(['message' => 'Login Successfully!']);
            } else {
                Auth::logout();
                return redirect()->back()->withErrors(['error' => 'Access restricted to admins only.']);
            }
        }
        Log::warning('Admin authentication failed for username.', ['username' => $validated['username']]);
        return redirect()->back()->withErrors( ['error'=>'The provided credentials do not match our records.']);
    }

    public function profile(){
        return Inertia::render('Admin/Profile',[
            'title' => 'Admin Profile',
            'admin' => Auth::user(),
        ]);
    }

}
