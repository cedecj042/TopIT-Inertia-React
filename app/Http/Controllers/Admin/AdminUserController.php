<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CoordinatorRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use App\Models\User;
use Auth;
use Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Admin::with('user');

        $perPage = request('items', 5);
        $admins = $query->paginate($perPage)->onEachSide(1);
        
        return Inertia::render('Admin/AdminUsers',[
            'title' => 'Admin Users',
            'auth' => Auth::user(),
            'admins' => AdminResource::collection($admins),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function create(CoordinatorRequest $request)
    {
        Log::info('im here ');
        $validated = $request->validated();

        $profileImage = $request->hasFile('profile_image')
            ? $request->file('profile_image')->store('profile_images', 'public')
            : 'profile-circle.png';
        
        $admin = Admin::create([
            'firstname' => $validated['firstname'],
            'lastname' => $validated['lastname'],
            'profile_image' => $profileImage,
            'last_login' => now(),
        ]);

        User::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'userable_id' => $admin->admin_id,
            'userable_type' => Admin::class,
        ]);

        return redirect()->back()->with('success', 'Coordinator added successfully!');

    }

    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
