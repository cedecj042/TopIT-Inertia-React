<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Http\Resources\CourseResource;
use App\Http\Resources\PdfResource;
use App\Jobs\ProcessCourse;
use App\Models\Course;
use App\Models\Pdf;
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
        
        if($title = request('title')){
            $query->where('title', 'like', '%' . $title . '%');
        }

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

    public function add(CourseRequest $request)
    {
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


    public function show(string $course_id)
    {
        //
        $course = Course::findOrFail($course_id);
        $pdfs = $course->pdfs()->paginate(5)->onEachSide(1);
        
        return Inertia::render('Admin/CourseDetail',[
            'title' => 'Admin Course',
            'auth'=> Auth::user(),
            'course'=> new CourseResource($course),
            'pdfs' => PdfResource::collection($pdfs),
            'queryParams'=>request()->query() ? :null,
        ]);
    }
    
    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function delete(string $course_id)
    {
        //
        $course = Course::findOrFail($course_id);
        $course->delete();
        return redirect()->back()->with('success', 'Course removed successfully!');
    }
}
