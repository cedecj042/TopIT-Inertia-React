<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterStudentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class StudentController extends Controller
{
    public function showRegisterForm()
    {
        return Inertia::render('Auth/StudentRegister',[
            'title'=>'Student Register'
        ]);
    }

    public function registerStudent(RegisterStudentRequest $request)
    {
        Log::info('Registration attempt:', $request->all());
        try {

            $validated = $request->validated();
            Log::info('Validation passed:', $validated);

            DB::transaction(function () use ($validated) {
                $imageName = null;
                if (isset($validated['profile_image'])) {
                    $profileImage = $validated['profile_image'];
                    $imageName = time() . '.' . $profileImage->extension();
                    $profileImage->storeAs('', $imageName, 'profile_images');
                }

                $student = new Student([
                    'firstname' => $validated['firstname'],
                    'lastname' => $validated['lastname'],
                    'birthdate' => $validated['birthdate'] ?? null,
                    'age' => $validated['birthdate'] ? Carbon::parse($validated['birthdate'])->age : null,
                    'gender' => $validated['gender'] ?? null,
                    'address' => $validated['address'] ?? null,
                    'course' => $validated['course'],
                    'school' => $validated['school'],
                    'year' => $validated['year'],
                    'profile_image' => $imageName,
                ]);

                $student->save();

                $user = User::create([
                    'username' => $validated['username'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'userable_id' => $student->student_id,
                    'userable_type' => 'App\Models\Student',
                ]);

                $user->save();
                Auth::login($user);
            });

            return Inertia::location(route('welcome'));

        } catch (ValidationException $e) {
            Log::error('Validation failed: ' . $e->getMessage());
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
         catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'An error occurred during registration.'])->withInput();
        }
        
    }


    public function showLoginForm()
    {
        return Inertia::render('Auth/StudentLogin');
    }

    public function loginStudent(LoginRequest $request)
    {

        $validated = $request->validated();

        if (Auth::attempt(['username' => $validated['username'], 'password' => $validated['password']])) {
            $user = Auth::user();
            if ($user->userable_type === 'App\Models\Student') {
                $request->session()->regenerate();
                return redirect()->intended('dashboard');
            } else {
                Auth::logout();
                return redirect()->route('login')->withErrors(['message' => 'Access restricted to students only.']);
            }
        }
        return back()->withErrors([
            'message' => 'The provided credentials do not match our records.'
        ])->withInput();
    }
}
