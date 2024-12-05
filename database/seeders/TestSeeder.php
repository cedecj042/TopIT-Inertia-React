<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Student;
use App\Models\Course;
use App\Models\Question;
use App\Enums\AssessmentType;
use App\Enums\AssessmentStatus;

class TestSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Get all students, courses, and questions
        $students = Student::with('student_course_thetas')->get();
        $courses = Course::all();
        $questions = Question::all();

        foreach ($students as $student) {
            // Create an assessment for the student
            $assessment = $student->assessments()->create([
                'type' => AssessmentType::TEST->value,
                'start_time' => $faker->time(),
                'end_time' => $faker->time(),
                'total_items' => $faker->numberBetween(20, 50),
                'total_score' => $faker->numberBetween(50, 100),
                'percentage' => $faker->randomFloat(2, 60, 100),
                'status' => AssessmentStatus::COMPLETED->value,
            ]);

            foreach ($courses as $course) {
                // Retrieve the initial theta from the relationship
                $studentCourseTheta = $student->student_course_thetas
                    ->where('course_id', $course->course_id)
                    ->first();

                if (!$studentCourseTheta) {
                    continue; // Skip if no theta is found for this course
                }

                $totalItems = $faker->numberBetween(5, 10);
                $totalScore = $faker->numberBetween(10, 20);
                $percentage = $faker->randomFloat(2, 50, 100);

                // Create the assessment_course
                $assessmentCourse = $assessment->assessment_courses()->create([
                    'course_id' => $course->course_id,
                    'total_items' => $totalItems,
                    'total_score' => $totalScore,
                    'initial_theta_score' => $studentCourseTheta->theta_score,
                    'final_theta_score' => $studentCourseTheta->theta_score, // Placeholder; will update later
                    'percentage' => $percentage,
                ]);

                // Fetch questions related to the course
                $courseQuestions = $questions->where('course_id', $course->course_id);
                $selectedQuestions = $courseQuestions->count() < $totalItems
                    ? $courseQuestions
                    : $courseQuestions->random($totalItems);

                $correctAnswers = 0;

                // Create assessment_items and calculate performance
                foreach ($selectedQuestions as $question) {
                    $isCorrect = $faker->boolean(70); // 70% chance of correct answer
                    $correctAnswers += $isCorrect ? 1 : 0;

                    $assessmentCourse->assessment_items()->create([
                        'question_id' => $question->question_id,
                        'participants_answer' => json_encode([$faker->word]),
                        'score' => $isCorrect ? 1 : 0,
                    ]);
                }

                // Update the final theta score based on performance
                $finalTheta = $studentCourseTheta->theta_score + (($correctAnswers / $totalItems) * 2 - 1);

                // Update the final theta in the related models
                $assessmentCourse->update(['final_theta_score' => $finalTheta]);
                $studentCourseTheta->update(['theta_score' => $finalTheta]);
            }
        }
    }
}
