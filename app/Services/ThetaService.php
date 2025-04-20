<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Course;
use App\Models\StudentCourseTheta;

class ThetaService
{
    public function logistic(float $x): float
    {
        return 1 / (1 + exp(-$x));
    }

    public function logLikelihood(float $theta, array $responses): float
    {
        $epsilon = 1e-10; // To avoid log(0)
        $sum = 0.0;
        foreach ($responses as $response) {
            $p = $this->logistic($response['discrimination'] * ($theta - $response['difficulty']));
            // Bound the probabilities to avoid extreme values
            $p = max($epsilon, min(1 - $epsilon, $p));
            $sum += $response['is_correct'] * log($p) + (1 - $response['is_correct']) * log(1 - $p);
        }
        return $sum;
    }

    public function firstDerivative(float $theta, array $responses): float
    {
        $sum = 0.0;
        foreach ($responses as $response) {
            $p = $this->logistic($response['discrimination'] * ($theta - $response['difficulty']));
            $sum += $response['discrimination'] * ($response['is_correct'] - $p);
        }
        // Add the gradient contribution from the normal prior (d/dθ log(Prior) = -θ)
        $priorGradient = -$theta;
        return $sum + $priorGradient;
    }

    public function secondDerivative(float $theta, array $responses): float
    {
        $sum = 0.0;
        foreach ($responses as $response) {
            $p = $this->logistic($response['discrimination'] * ($theta - $response['difficulty']));
            $sum += -pow($response['discrimination'], 2) * $p * (1 - $p);
        }
        // Add the Hessian contribution from the normal prior (d²/dθ² log(Prior) = -1)
        $priorHessian = -1;
        return $sum + $priorHessian;
    }

    public function estimateThetaMAP($responses, $theta_init)
    {
        $max_iter = 100;
        $tol = 1e-6;
        $theta = $theta_init;
        \Log::info("[Simulation Log]\n");
        \Log::info("---------------------------------------------------------------\n");
        \Log::info( "Starting MAP estimation with theta = " . round($theta, 4) . "\n");

        for ($i = 0; $i < $max_iter; $i++) {
            $grad = $this->firstDerivative($theta, $responses);
            $hess = $this->secondDerivative($theta, $responses);

            if ($hess == 0) {
                \Log::info( "Hessian is zero. Stopping iteration.\n");
                break;
            }

            $theta_new = $theta - $grad / $hess;
            // Enforce the constraint [-5, 5]
            $theta_new = max(-5, min(5, $theta_new));
            $delta = abs($theta_new - $theta);

            // Log only if the change is significant or it's the final iteration.
            if ($i == 0 || $delta > 0.01 || $delta < $tol) {
                \Log::info("Iteration " . ($i + 1) . ":\n");
                \Log::info("  Theta: " . round($theta, 4) . " → " . round($theta_new, 4) . "\n");
                \Log::info("  Gradient: " . round($grad, 4) . "\n");
                \Log::info("  Hessian: " . round($hess, 4) . "\n");
                \Log::info("  Delta: " . round($delta, 4) . "\n");
            }

            if ($delta < $tol) {
                $theta = $theta_new;
                \Log::info("Convergence achieved.\n");
                break;
            }

            $theta = $theta_new;
        }
        \Log::info("Final MAP theta estimate: " . round($theta, 4) . "\n");
        \Log::info("---------------------------------------------------------------\n");
        return $theta;
    }

    // public function firstDerivative(float $theta, array $responses): float
    // {
    //     $sum = 0.0;
    //     foreach ($responses as $response) {
    //         $p = $this->logistic($response['discrimination'] * ($theta - $response['difficulty']));
    //         $weight = $response['weight'] ?? 1.0;
    //         $sum += $weight * $response['discrimination'] * ($response['is_correct'] - $p);
    //     }
    //     return $sum - $theta; // includes prior gradient
    // }

    // public function secondDerivative(float $theta, array $responses): float
    // {
    //     $sum = 0.0;
    //     foreach ($responses as $response) {
    //         $p = $this->logistic($response['discrimination'] * ($theta - $response['difficulty']));
    //         $weight = $response['weight'] ?? 1.0;
    //         $sum += -$weight * pow($response['discrimination'], 2) * $p * (1 - $p);
    //     }
    //     return $sum - 1; // includes prior hessian
    // }


    // public function estimateThetaMLE(float $initialTheta, array $responses): float
    // {
    //     $theta = $initialTheta;
    //     $tolerance = 1e-6; // Convergence tolerance
    //     $maxIterations = 100; // Maximum number of iterations
    //     $thetaMin = -5.0; // Lower bound for theta
    //     $thetaMax = 5.0;  // Upper bound for theta

    //     for ($iteration = 0; $iteration < $maxIterations; $iteration++) {
    //         $numerator = 0.0;
    //         $denominator = 0.0;

    //         foreach ($responses as $response) {
    //             $a = $response['discrimination'];
    //             $b = $response['difficulty'];
    //             $isCorrect = $response['is_correct'];

    //             $pTheta = 1 / (1 + exp(-$a * ($theta - $b))); // P(\theta)
    //             $qTheta = 1 - $pTheta; // Q(\theta)

    //             // First derivative (gradient)
    //             $numerator += $a * ($isCorrect - $pTheta);

    //             // Second derivative (Hessian)
    //             $denominator += $a * $a * $pTheta * $qTheta;
    //         }

    //         // Check for zero denominator
    //         if (abs($denominator) < 1e-6) {
    //             break; // Avoid division by zero or very small denominator
    //         }

    //         // Newton-Raphson update
    //         $delta = $numerator / $denominator;
    //         $theta += 0.5 * ($numerator / $denominator);

    //         // Clamp theta to be within the range [-5, 5]
    //         $theta = max($thetaMin, min($thetaMax, $theta));

    //         // Check for convergence
    //         if (abs($delta) < $tolerance) {
    //             break;
    //         }
    //     }
    //     return $theta;
    // }


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

            StudentCourseTheta::upsert($data, ['student_id', 'course_id'], ['theta_score', 'updated_at']);
        }
    }


    public function initializeThetaForCourse(Course $course)
    {
        $students = Student::all();

        if ($students->isNotEmpty()) {
            $data = $students->map(fn($student) => [
                'student_id' => $student->student_id,
                'course_id' => $course->course_id,
                'theta_score' => 0.0,
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray();

            StudentCourseTheta::upsert($data, ['student_id', 'course_id'], ['theta_score', 'updated_at']);
        }
    }




}
