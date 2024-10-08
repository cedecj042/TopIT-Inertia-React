<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\Test;
use App\Models\TestCourse;
use App\Models\Course;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        // Get all students and courses
        $students = Student::all();
        $courses = Course::all();

        // Loop through each student and create test entries
        foreach ($students as $student) {
            // Create a test for the student
            $test = Test::create([
                'student_id' => $student->student_id,
                'start_time' => $faker->time(),
                'end_time' => $faker->time(),
                'totalItems' => $faker->numberBetween(20, 50),
                'totalScore' => $faker->numberBetween(50, 100),
                'percentage' => $faker->randomFloat(2, 60, 100),
                'status' => $faker->randomElement(['completed', 'incomplete']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create test_courses entries for each course
            foreach ($courses as $course) {
                TestCourse::create([
                    'test_id' => $test->test_id,
                    'course_id' => $course->course_id,
                    'theta_score' => $faker->randomFloat(2, -5, 5), // Example theta score range (-3 to +3)
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            foreach ($courses as $course) {
                TestCourse::create([
                    'test_id' => $test->test_id,
                    'course_id' => $course->course_id,
                    'theta_score' => $faker->randomFloat(2, -5, -3), // Example theta score range (-3 to +3)
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            foreach ($courses as $course) {
                TestCourse::create([
                    'test_id' => $test->test_id,
                    'course_id' => $course->course_id,
                    'theta_score' => $faker->randomFloat(2, -1, 3), // Example theta score range (-3 to +3)
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            foreach ($courses as $course) {
                TestCourse::create([
                    'test_id' => $test->test_id,
                    'course_id' => $course->course_id,
                    'theta_score' => $faker->randomFloat(2, 2, 5), // Example theta score range (-3 to +3)
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
