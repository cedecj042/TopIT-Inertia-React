<?php

namespace Database\Seeders;
use App\Models\Student;
use App\Models\Course;
use App\Models\Question;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use App\Enums\AssessmentType;
use App\Enums\AssessmentStatus;

class TestSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Get all students, courses, and questions
        $students = Student::all();
        $courses = Course::all();
        $questions = Question::all();

        foreach ($students as $student) {
            // Create an assessment for each student
            $assessmentId = DB::table('assessments')->insertGetId([
                'student_id' => $student->student_id,
                'type' => AssessmentType::TEST->value,  // Using enum for type
                'start_time' => $faker->time(),
                'end_time' => $faker->time(),
                'total_items' => $faker->numberBetween(20, 50),
                'total_score' => $faker->numberBetween(50, 100),
                'percentage' => $faker->randomFloat(2, 60, 100),
                'status' => $faker->randomElement([
                    AssessmentStatus::COMPLETED->value,
                    AssessmentStatus::IN_PROGRESS->value,
                    AssessmentStatus::NOT_STARTED->value,
                ]),  // Using enum for status
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create assessment_courses entries for each course
            foreach ($courses as $course) {
                $totalItems = $faker->numberBetween(5, 10);
                $totalScore = $faker->numberBetween(10, 20);
                $percentage = $faker->randomFloat(2, 50, 100);

                $assessmentCourseId = DB::table('assessment_courses')->insertGetId([
                    'assessment_id' => $assessmentId,
                    'course_id' => $course->course_id,
                    'total_items' => $totalItems,
                    'total_score' => $totalScore,
                    'percentage' => $percentage,
                    'theta_score' => $faker->randomFloat(2, -5, 5), 
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Select random questions for the course
                $courseQuestions = $questions->where('course_id', $course->course_id);
                $availableQuestionsCount = $courseQuestions->count();

                // Check if there are enough questions available
                if ($availableQuestionsCount < $totalItems) {
                    // Use all available questions if not enough
                    $selectedQuestions = $courseQuestions;
                } else {
                    // Select the specified number of random questions
                    $selectedQuestions = $courseQuestions->random($totalItems);
                }

                // Create assessment_items entries for each selected question
                foreach ($selectedQuestions as $question) {
                    DB::table('assessment_items')->insert([
                        'assessment_course_id' => $assessmentCourseId,
                        'question_id' => $question->question_id,
                        'participants_answer' => json_encode([$faker->word]),  // Sample participant's answer
                        'score' => $faker->numberBetween(0, 1),  // Assuming binary score for correct/incorrect answers
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
