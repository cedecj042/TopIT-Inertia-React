<?php

namespace App\Http\Controllers\Student;

use App\Enums\ContentType;
use App\Http\Controllers\Controller;
use App\Http\Resources\ModuleResource;
use App\Models\Course;
use App\Models\Module;
use Inertia\Inertia;

class StudentCourseController extends Controller
{

    public function index()
    {
        $courses = Course::all(); 
        return Inertia::render('Student/Courses/Courses', [
            'title'=>'Student Course',
            'courses' => $courses,
        ]);
    }

    public function show(int $id)
    {
        $course = Course::with('modules')->findOrFail($id); 
        return Inertia::render('Student/Courses/CoursesDetail', [
            'title' => 'Student Course',
            'course' => $course,
        ]);
    }


    public function module($id)
    {
        // Define a closure to apply ordering by 'order' column
        $orderAttachments = function ($query) {
            $query->orderBy('order');
        };
        // Eager load relationships with ordered attachments
        $module = Module::with([
            'course:course_id,title', // Load only necessary columns from course
            'contents' => $orderAttachments,
            'lessons.contents' => $orderAttachments,
            'lessons.sections.contents' => $orderAttachments,
            'lessons.sections.subsections.contents' => $orderAttachments,
        ])->findOrFail($id);
        
        return Inertia::render('Student/Courses/Module', [
            'title' => 'Student Course',
            'module' => new ModuleResource($module), // Use ModuleResource for formatting
        ]);
    }
}
