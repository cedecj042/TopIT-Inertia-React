<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Http\Resources\CourseResource;
use App\Jobs\ProcessCourse;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Course::query();

        $perPage = request('items', 5);

        $courses = $query->paginate($perPage)->onEachSide(1);
        //
        return Inertia::render('Admin/Course',[
            'title' => 'Admin Course',
            'auth'=> Auth::user(),
            'courses'=>CourseResource::collection($courses),
            'queryParams'=>request()->query() ? :null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function add(CourseRequest $request)
    {
        Log::info('running');
        $validatedData = $request->validated();

        Log::info('Validated data:', $validatedData);

        try {
            $course = Course::create([
                'title' => $validatedData['course_name'],
                'description' => $validatedData['course_desc'],
            ]);
            $course->save();

            Log::info('Course saved successfully:', ['course_id' => $course->course_id]);
            // ProcessCourse::dispatch($course->course_id);
            return redirect()->back()->with(['success'=>'Course added successfully!']);
        } catch (\Exception $e) {
            Log::error('Error saving course:', ['exception' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error'=>'Failed to add course. Please try again.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $course_id)
    {
        //
        $course = Course::with('pdfs')->findOrFail($course_id);
        
        return Inertia::render('Admin/CourseDetail',[
            'title' => 'Admin Course',
            'auth'=> Auth::user(),
            'course'=> new CourseResource($course),
            'queryParams'=>request()->query() ? :null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
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
    public function delete(string $course_id)
    {
        //
        $course = Course::findOrFail($course_id);
        $course->delete();
        return redirect()->back()->with('success', 'Course removed successfully!');
    }
}
