<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Course;
use App\Models\StudentCourseTheta;

class ThetaService
{
    /**
     * Maximum Likelihood Estimation (MLE) for theta value based on 2PL model.
     *
     * @param float $initialTheta The initial theta value.
     * @param array $responses An array of responses with keys:
     *                         - 'is_correct' (bool): Indicates if the student's answer was correct.
     *                         - 'discrimination' (float): The discrimination parameter (a).
     *                         - 'difficulty' (float): The difficulty parameter (b).
     * @return float The estimated theta value.
     */
    public function estimateThetaMLE(float $initialTheta, array $responses): float
    {
        $theta = $initialTheta;
        $tolerance = 1e-5; // Convergence tolerance
        $maxIterations = 20; // Maximum number of iterations

        for ($iteration = 0; $iteration < $maxIterations; $iteration++) {
            $numerator = 0.0;
            $denominator = 0.0;

            foreach ($responses as $response) {
                $a = $response['discrimination'];
                $b = $response['difficulty'];
                $isCorrect = $response['is_correct'];

                $pTheta = 1 / (1 + exp(-$a * ($theta - $b))); // P(\theta)
                $qTheta = 1 - $pTheta; // Q(\theta)

                // First derivative (gradient)
                $numerator += $a * ($isCorrect - $pTheta);

                // Second derivative (Hessian)
                $denominator += $a * $a * $pTheta * $qTheta;
            }

            // Newton-Raphson update
            $delta = $numerator / $denominator;
            $theta += $delta;

            // Check for convergence
            if (abs($delta) < $tolerance) {
                break;
            }
        }
        return $theta;
    }

    /**
     * Save the updated theta value for a student in the database.
     *
     * @param Student $student The student object.
     * @param Course $course The course object.
     * @param float $newTheta The updated theta value.
     * @return void
     */
    public function updateThetaForStudent(Student $student, Course $course, float $newTheta): void
    {
        $studentCourseTheta = StudentCourseTheta::firstOrCreate(
            [
                'student_id' => $student->id,
                'course_id' => $course->id,
            ],
            [
                'theta_score' => 0.0, // Default theta value
            ]
        );

        // Update the theta value
        $studentCourseTheta->theta_score = $newTheta;
        $studentCourseTheta->save();
    }

    /**
     * Process responses incrementally for adaptive testing.
     *
     * @param Student $student The student object.
     * @param Course $course The course object.
     * @param array $responses An array of responses with keys:
     *                         - 'is_correct' (bool): Indicates if the student's answer was correct.
     *                         - 'discrimination' (float): The discrimination parameter (a).
     *                         - 'difficulty' (float): The difficulty parameter (b).
     * @param int $maxItems The maximum number of items to administer (default: 20).
     * @return void
     */
    public function processAdaptiveTest(Student $student, Course $course, array $responses, int $maxItems = 20): void
    {
        // Retrieve the current theta for the student and course
        $currentTheta = StudentCourseTheta::where('student_id', $student->id)
            ->where('course_id', $course->id)
            ->value('theta') ?? 0.0;

        // Process up to the maximum number of items
        $administeredResponses = [];

        foreach ($responses as $index => $response) {
            if ($index >= $maxItems) {
                break;
            }

            // Add the current response to the administered responses
            $administeredResponses[] = $response;

            // Recalculate theta using the responses so far
            $currentTheta = $this->estimateThetaMLE($currentTheta, $administeredResponses);
        }

        // Save the final theta to the database
        $this->updateThetaForStudent($student, $course, $currentTheta);
    }

    /**
     * Initialize theta for the student
     *
     * @param Student $student The student object.
     * @return void
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
     * Initialize theta for the student
     *
     * @param Course $course The student object.
     * @return void
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

    public function getTheta(int $course_id,int $student_id){
        
        $studentCourseTheta = StudentCourseTheta::where('student_id', $student_id)
        ->where('course_id', $course_id)
        ->first();
        
        if ($studentCourseTheta) {
            return $studentCourseTheta->theta_score; // Return the theta value
        }
    
        return 0.0;
    }
}
