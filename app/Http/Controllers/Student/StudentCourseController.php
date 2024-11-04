<?php

namespace App\Http\Controllers\Student;

use App\Enums\AttachmentType;
use App\Http\Controllers\Controller;
use App\Http\Resources\ModuleResource;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentCourseController extends Controller
{

    public function showStudentCourse()
    {
        $courses = Course::all(); 
        return Inertia::render('Student/Courses/Courses', [
            'title'=>'Student Course',
            'courses' => $courses,
        ]);
    }

    public function showStudentCourseDetail($id)
    {
        $course = Course::with('modules')->findOrFail($id); 
        return Inertia::render('Student/Courses/CoursesDetail', [
            'title' => 'Student Course',
            'course' => $course,
        ]);
    }


    public function showModuleDetail($id)
    {
        $module = Module::with([
            'course:course_id,title', // Load only necessary columns from course
            'lessons.sections.subsections.attachments' => function ($query) {
                // Filter specific attachment types across all levels
                $query->whereIn('type', [
                    AttachmentType::FIGURE->value,
                    AttachmentType::TABLE->value,
                    AttachmentType::CODE->value,
                    AttachmentType::TEXT->value,
                ])->orderBy('order');
            },
            'lessons.sections.attachments' => function ($query) {
                // Filter specific attachment types for sections
                $query->whereIn('type', [
                    AttachmentType::FIGURE->value,
                    AttachmentType::TABLE->value,
                    AttachmentType::CODE->value,
                    AttachmentType::TEXT->value,
                ])->orderBy('order');
            },
            'lessons.attachments' => function ($query) {
                // Filter specific attachment types for lessons
                $query->whereIn('type', [
                    AttachmentType::FIGURE->value,
                    AttachmentType::TABLE->value,
                    AttachmentType::CODE->value,
                    AttachmentType::TEXT->value,
                ])->orderBy('order');
            }
        ])->findOrFail($id);
        return Inertia::render('Student/Courses/Module', [
            'title' => 'Student Course',
            'module' => new ModuleResource($module), // Use ModuleResource for formatting
        ]);
    }
}
