<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Auth/Student/StudentLogin');
    }

    public function loginStudent(Request $request){
        
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:6'
        ]);

        if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
            $user = Auth::user();
            Log::info('User authenticated successfully.', ['user_id' => $user->user_id]);

            if ($user->userable_type === 'App\Models\Student') {
                Log::info('Authenticated user is a Student.', ['user_id' => $user->user_id]);
                $request->session()->regenerate();
                return redirect()->intended('dashboard');
            } else {
                Auth::logout();
                Log::warning('Access restricted. User is not a Student.', ['user_id' => $user->user_id]);
                return redirect()->route('login')->withErrors(['username' => 'Access restricted to students only.']);
            }
        }
        return back()->withErrors([
            'username' => 'The provided credentials do not match our records.'
        ])->withInput();

    }
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
