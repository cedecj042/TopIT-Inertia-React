<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;

class StudentCourseController extends Controller
{
    /**
     * Show the list of student courses.
     *
     * @return \Inertia\Response
     */
    public function showStudentCourse()
    {
        $courses = Course::all(); 
        return inertia('Student/Courses/Courses', [
            'courses' => $courses,
        ]);
    }

    /**
     * Show the details of a specific student course.
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function showStudentCourseDetail($id)
    {
        $course = Course::with('modules')->findOrFail($id); 
        return inertia('Student/Courses/CoursesDetail', [
            'course' => $course,
        ]);
    }

    /**
     * Show the details of a specific module.
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function showModuleDetail($id)
    {
        $module = Module::with([
            'lessons' => function ($query) {
                $query->with([
                    'sections' => function ($query) {
                        $query->with([
                            'subsections' => function ($query) {
                                $query->with([
                                    'tables.images',
                                    'figures.images',
                                    'codes.images'
                                ]);
                            },
                            'tables.images',
                            'figures.images',
                            'codes.images'
                        ]);
                    }
                ]);
            }
        ])->findOrFail($id);

        $moduleContent = json_decode($module->content, true); // Decode module content
        return inertia('Student/Courses/Module', [
            'module' => $module,
            'moduleContent' => $moduleContent,
        ]);
    }
}
