<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CoordinatorRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            'admins' => AdminResource::collection($admins),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function create(CoordinatorRequest $request)
    {
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

    public function delete(int $id)
    {
        $admin = Admin::find($id);
        if (!$admin) {
            return redirect()->back()->with('error', 'Admin not found!');
        }
        $user = User::where('userable_id', $id)
            ->where('userable_type', Admin::class)
            ->first();

        if ($user) {
            $user->delete(); // Delete the User record
        }
        $admin->delete();
        return redirect()->back()->with('success', 'Coordinator deleted successfully!');
    }

}
