<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AttachmentType;
use App\Http\Controllers\Controller;
use App\Http\Resources\ModuleResource;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Module::with(['course:course_id,title']);


        if ($title = request('title')) {
            $query->where('title', 'like', '%' . $title . '%');
        }
        // Filter by course_id if provided
        if ($courseTitle = request('course')) {
            // Query the course table to get the course_id based on the course title
            $course = DB::table('courses')->where('title', 'like', '%' . $courseTitle . '%')->first();

            if ($course) {
                $query->where('course_id', $course->course_id);
            } else {
                $query->whereNull('course_id');
            }
        }

        $perPage = request('items', 5);
        $modules = $query->paginate($perPage)->onEachSide(1);

        $title =  DB::table('courses')->distinct()->pluck('title');
        $filters = [
            'courses' => $title
        ];
        return Inertia::render('Admin/Modules/Module', [
            'title' => 'Admin Module',
            'auth' => Auth::user(),
            'modules' => ModuleResource::collection($modules),
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Define a closure to apply ordering by 'order' column
        $orderAttachments = function ($query) {
            $query->orderBy('order');
        };

        // Eager load relationships with ordered attachments
        $module = Module::with([
            'course:course_id,title', // Load only necessary columns from course
            'attachments' => $orderAttachments,
            'lessons.attachments' => $orderAttachments,
            'lessons.sections.attachments' => $orderAttachments,
            'lessons.sections.subsections.attachments' => $orderAttachments,
        ])->findOrFail($id);

        // Return the Inertia render with the module details
        return Inertia::render('Admin/Modules/ModuleDetail', [
            'title' => 'Admin Module',
            'auth' => Auth::user(),
            'module' => new ModuleResource($module), // Use ModuleResource for formatting
        ]);
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Eager load all attachments at each level without filtering by type
        $module = Module::with([
            'course:course_id,title', // Load only necessary columns from course
            'attachments',
            'lessons.attachments',
            'lessons.sections.attachments',
            'lessons.sections.subsections.attachments',
        ])->findOrFail($id);

        // Return the Inertia render with the module details
        return Inertia::render('Admin/Modules/ModuleEdit', [
            'title' => 'Admin Module',
            'auth' => Auth::user(),
            'module' => new ModuleResource($module), // Use ModuleResource for formatting
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(string $id) {}
}
