<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Question;

class PretestSeeder extends Seeder
{
    public function run()
    {
        // Fetch all students (assuming students table exists)
        $students = DB::table('students')->get(); // Adjust table name if needed

        // Fetch all courses
        $courses = DB::table('courses')->get();

        // Fetch questions with their course associations
        $questions = DB::table('questions')->get();

        // Loop through each student to create a pretest
        foreach ($students as $student) {
            // Create a new pretest for the student
            $pretest_id = DB::table('tests')->insertGetId([
                'student_id' => $student->student_id,
                'totalItems' => 0, // Will update after inserting questions
                'totalScore' => 0, // Will update after calculating answers
                'percentage' => 0, // Calculated later
                'status' => 'incomplete', // Mark as incomplete initially
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($courses as $course) {
                // Create a new pretest_course entry for each course
                $pretest_course_id = DB::table('pretest_courses')->insertGetId([
                    'pretest_id' => $pretest_id,
                    'course_id' => $course->course_id,
                    'theta_score' => rand(-3, 3), // Example theta score; adjust as needed
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Fetch 5 random questions for the current course
                $courseQuestions = $questions
                    ->where('course_id', $course->course_id)
                    ->random(5);

                foreach ($courseQuestions as $question) {
                    // Insert into pretest_questions
                    $pretest_question_id = DB::table('pretest_questions')->insertGetId([
                        'question_id' => $question->question_id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    // Insert into pretest_answers with a default empty answer and score of 0
                    DB::table('pretest_answers')->insert([
                        'pretest_course_id' => $pretest_course_id,
                        'pretest_question_id' => $pretest_question_id,
                        'participants_answer' => json_encode($participants_answer ?? []), // Empty answer initially
                        'score' => 0, // Default score
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                // Update the total items for the pretest
                $totalItems = DB::table('pretest_questions')
                    ->whereIn('question_id', $courseQuestions->pluck('question_id'))
                    ->count();

                DB::table('pretests')
                    ->where('pretest_id', $pretest_id)
                    ->update(['totalItems' => $totalItems]);
            }
        }
    }
}
