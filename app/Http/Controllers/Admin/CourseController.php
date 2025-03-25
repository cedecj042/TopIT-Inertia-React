<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Http\Resources\CourseResource;
use App\Http\Resources\PdfResource;
use App\Models\Course;
use App\Services\FastApiService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CourseController extends Controller
{
    protected $fastAPIService;

    public function __construct(FastApiService $fastAPIService)
    {
        $this->fastAPIService = $fastAPIService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Course::query();
        
        if($title = request('title')){
            $query->where('title', 'like', '%' . $title . '%');
        }

        $sort = request()->query('sort', ''); // Empty by default
        $sortField = $sortDirection = null;  // Initialize sortField and sortDirection as null

        // Only split if $sort is not empty
        if (!empty($sort)) {
            [$sortField, $sortDirection] = explode(':', $sort);
                
            // Ensure sortDirection is either 'asc' or 'desc', otherwise set it to null
            if (!in_array($sortDirection, ['asc', 'desc'])) {
                $sortDirection = null;
            }
        }

        if (!empty($sortField) && !empty($sortDirection)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $perPage = request('items', 5);

        $courses = $query->paginate($perPage)->onEachSide(1);
        //
        return Inertia::render('Admin/Courses/Course',[
            'title' => 'Admin Course',
            'courses'=>CourseResource::collection($courses),
            'queryParams'=>request()->query() ? :null,
        ]);
    }

    public function add(CourseRequest $request)
    {
        $validatedData = $request->validated();

        $exists = Course::where('title', $validatedData['course_title'])->exists();
        if ($exists) {
            return back()->with('error', 'Course with the same name already exists.');
        }
        try {
            $course = Course::create([
                'title' => $validatedData['course_title'],
                'description' => $validatedData['course_desc'],
            ]);
            $course->save();
            //Save the course to vector
            return back()->with('success', 'Course added successfully!');
        } catch (\Exception $e) {
            Log::error('Error saving course:', ['exception' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Your custom error message']);
        }
    }


    public function show(int $id)
    {
        //
        $course = Course::findOrFail($id);
        $pdfs = $course->pdfs()->paginate(5)->onEachSide(1);
        
        return Inertia::render('Admin/Courses/CourseDetail',[
            'title' => 'Admin Course',
            'course'=> new CourseResource($course),
            'pdfs' => PdfResource::collection($pdfs),
            'queryParams'=>request()->query() ? :null,
        ]);
    }

    public function update(CourseRequest $request, int $id)
    {
        $validated = $request->validated();

        $prevCourse = Course::findOrFail($id);
        if($prevCourse->title != $validated['course_title']){
            $exists = Course::where('title', $validated['course_title'])->exists();
            if ($exists) {
                return back()->with('error', 'Course with the same name already exists.');
            } 
        }
        $prevCourse->update([
            'title' => $validated['course_title'],
            'description' => $validated['course_desc'],
        ]);
        return back()->with('success', 'Course updated successfully.');
    }

    public function delete(int $id)
    {
        $course = Course::findOrFail($id);
        // Check if there are questions associated with the course
        if ($course->questions()->count() > 0) {
            return back()->with('error', 'Cannot delete course. Questions are tied to this course.');
        }
        
        $course->delete();
        return back()->with('success', 'Course removed successfully!');
    }
}
