<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Course;
use App\Models\StudentCourseTheta;

class ThetaService
{
    /**
     * Initialize theta scores for all students for a given course.
     */
    public function initializeThetaForCourse(Course $course)
    {
        $students = Student::all();

        if ($students->isNotEmpty()) {
            $data = $students->map(function ($student) use ($course) {
                return [
                    'student_id' => $student->student_id,
                    'course_id' => $course->course_id,
                    'theta_score' => 0.0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            StudentCourseTheta::insert($data);
        }
    }

    /**
     * Initialize theta scores for all courses for a new student.
     */
    public function initializeThetaForStudent(Student $student)
    {
        $courses = Course::all();

        if ($courses->isNotEmpty()) {
            $data = $courses->map(function ($course) use ($student) {
                return [
                    'student_id' => $student->student_id,
                    'course_id' => $course->course_id,
                    'theta_score' => 0.0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            StudentCourseTheta::insert($data);
        }
    }

    /**
     * Clean up theta records for a deleted course.
     */
    public function cleanupThetaForDeletedCourse(Course $course)
    {
        StudentCourseTheta::where('course_id', $course->course_id)->delete();
    }
    
}
