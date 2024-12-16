<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminProfileEdit;
use App\Http\Requests\LoginRequest;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
    public function update(AdminProfileEdit $request)
    {
        $validatedData = $request->validated();
    
        $user = User::findOrFail($validatedData["user_id"]);
        $admin = Admin::findOrFail($user->userable_id); 

        if ($request->hasFile('profile_image')) {
            if ($admin->profile_image && Storage::exists($admin->profile_image)) {
                Storage::delete($admin->profile_image);
            }
            $profileImage = $validatedData['profile_image'];
            $imageName = time() . '.' . $profileImage->extension();
            $profileImage->storeAs('', $imageName, 'profile_images');
        } else {
            // Keep the existing profile image if no new image is uploaded
            $imageName = $admin->profile_image;
        }
        
    
        $user->update([
            'email' => $validatedData['email'],
            'username' => $validatedData['username'],
        ]);
    
        $admin->update([
            'firstname' => $validatedData['firstname'],
            'lastname' => $validatedData['lastname'],
            'profile_image' => $imageName,
        ]);
    
        return back()->with('success', 'Profile Updated successfully!');
    }
    

}
