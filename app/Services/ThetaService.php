<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Course;
use App\Models\StudentCourseTheta;

class ThetaService
{
    /**
     * Compute the logistic function.
     *
     * @param float $x
     * @return float
     */
    public function logistic(float $x): float
    {
        return 1 / (1 + exp(-$x));
    }

    /**
     * Compute the log-likelihood of the 2PL model using the new responses format.
     *
     * @param float $theta Current ability estimate.
     * @param array $responses Array of responses with is_correct, discrimination, and difficulty.
     * @return float
     */
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

    /**
     * Compute the first derivative (gradient) of the log-likelihood plus the log-prior using the new responses format.
     *
     * @param float $theta
     * @param array $responses
     * @return float
     */
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

    /**
     * Compute the second derivative (Hessian) of the log-likelihood plus the log-prior using the new responses format.
     *
     * @param float $theta
     * @param array $responses
     * @return float
     */
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

    /**
     * Use the Newton-Raphson method to perform MAP estimation of ability (θ).
     *
     * @param array $responses Array of responses with is_correct, discrimination, and difficulty.
     * @param float $theta_init Initial guess for θ.
     * @param int $max_iter Maximum number of iterations.
     * @param float $tol Convergence tolerance.
     * @return float Estimated θ.
     */
    public function estimateThetaMAP(array $responses, float $theta_init): float
    {
        $max_iter = 100;
        $tol = 1e-6;
        $theta = $theta_init;
        for ($i = 0; $i < $max_iter; $i++) {
            $grad = $this->firstDerivative($theta, $responses);
            $hess = $this->secondDerivative($theta, $responses);

            // Avoid division by zero
            if ($hess == 0) {
                break;
            }

            // Newton-Raphson update step
            $theta_new = $theta - $grad / $hess;

            // Enforce the ability range constraint [-5, 5]
            $theta_new = max(-5, min(5, $theta_new));

            // Check for convergence
            if (abs($theta_new - $theta) < $tol) {
                $theta = $theta_new;
                break;
            }
            $theta = $theta_new;
        }
        return $theta;
    }

    // public function calculateWeightedPriorDistribution(
    //     array $theta_scores,
    //     float $lambda = 0.1,            // Decay parameter controlling influence of older tests
    //     float $defaultMean = 0.0,
    //     float $defaultVariance = 1.5    // More diffuse prior if there's little data
    // ) {
    //     $n = count($theta_scores);
    //     \Log::info("Calculating weighted prior distribution from {$n} tests using exponential decay with λ = {$lambda}.");
    
    //     // Fallback to defaults if there are no scores
    //     if ($n === 0) {
    //         return [
    //             'mean' => $defaultMean,
    //             'variance' => $defaultVariance,
    //         ];
    //     }
    
    //     // Calculate weights for each assessment.
    //     // Assumption: $theta_scores is ordered from oldest (index 0) to newest.
    //     $weights = [];
    //     for ($i = 0; $i < $n; $i++) {
    //         // Newest test (i = n-1) gets a weight of 1; older ones have exponentially lower weights.
    //         $weights[$i] = exp(-$lambda * ($n - 1 - $i));
    //     }
    
    //     // Normalize the weights
    //     $sumWeights = array_sum($weights);
    //     if ($sumWeights == 0) {
    //         // In case of any numerical issues, assign equal weights
    //         $weights = array_fill(0, $n, 1.0);
    //         $sumWeights = $n;
    //     }
    
    //     // Calculate the weighted mean.
    //     $weightedMean = 0.0;
    //     foreach ($theta_scores as $i => $score) {
    //         $weightedMean += $score * $weights[$i];
    //     }
    //     $weightedMean /= $sumWeights;
    
    //     // Calculate the weighted variance.
    //     $weightedVariance = 0.0;
    //     foreach ($theta_scores as $i => $score) {
    //         $diff = $score - $weightedMean;
    //         $weightedVariance += $weights[$i] * ($diff * $diff);
    //     }
    //     $weightedVariance /= $sumWeights; // Population-based estimation (could adjust for sample bias if needed)
    
    //     // Enforce minimum and maximum variance limits if necessary.
    //     $minVariance = 1e-6;
    //     $maxVariance = 2.0;
    //     $weightedVariance = max($weightedVariance, $minVariance);
    //     $weightedVariance = min($weightedVariance, $maxVariance);
    
    //     return [
    //         'mean' => $weightedMean,
    //         'variance' => $weightedVariance,
    //     ];
    // }

    // public function calculateWeightedPriorDistribution(
    //     array $theta_scores,
    //     float $lambda = 0.1,            // Decay parameter controlling influence of older tests
    //     float $defaultMean = 0.0,
    //     float $defaultVariance = 1.0    // More diffuse prior if there's little data
    // ) {
    //     $n = count($theta_scores);
    //     \Log::info("Calculating weighted prior distribution from {$n} tests using exponential decay with λ = {$lambda}.");
    
    //     // Fallback to defaults if there are no scores
    //     if ($n < 5) {
    //         return [
    //             'mean' => $defaultMean,
    //             'variance' => $defaultVariance,
    //         ];
    //     }
    
    //     // Calculate weights for each assessment.
    //     // Assumption: $theta_scores is ordered from oldest (index 0) to newest.
    //     $weights = [];
    //     for ($i = 0; $i < $n; $i++) {
    //         // Newest test (i = n-1) gets a weight of 1; older ones have exponentially lower weights.
    //         $weights[$i] = exp(-$lambda * ($n - 1 - $i));
    //     }
    
    //     // Normalize the weights
    //     $sumWeights = array_sum($weights);
    //     if ($sumWeights == 0) {
    //         // In case of any numerical issues, assign equal weights
    //         $weights = array_fill(0, $n, 1.0);
    //         $sumWeights = $n;
    //     }
    
    //     // Calculate the weighted mean.
    //     $weightedMean = 0.0;
    //     foreach ($theta_scores as $i => $score) {
    //         $weightedMean += $score * $weights[$i];
    //     }
    //     $weightedMean /= $sumWeights;
    
    //     // Calculate the weighted variance.
    //     $weightedVariance = 0.0;
    //     foreach ($theta_scores as $i => $score) {
    //         $diff = $score - $weightedMean;
    //         $weightedVariance += $weights[$i] * ($diff * $diff);
    //     }
    //     $weightedVariance /= $sumWeights; // Population-based estimation (could adjust for sample bias if needed)
    
    //     // Enforce minimum and maximum variance limits if necessary.
    //     // $minVariance = 1e-6;
    //     // $maxVariance = 0.5;
    //     // $weightedVariance = max($weightedVariance, $minVariance);
    //     // $weightedVariance = min($weightedVariance, $maxVariance);
    
    //     return [
    //         'mean' => $weightedMean,
    //         'variance' => $weightedVariance,
    //     ];
    // }
    
    

    // public function estimateThetaMAP(
    //     array $responses,
    //     float $initialTheta,
    //     float $priorMean,
    //     float $priorVariance,
    //     float $priorWeight = 0.6  // New parameter to adjust prior influence
    // ): float {
    //     $theta = $initialTheta;
    //     $tolerance = 1e-5;      // Convergence tolerance
    //     $maxIterations = 100;   // Maximum number of iterations
    //     $thetaMin = -5.0;       // Lower bound for theta
    //     $thetaMax = 5.0;        // Upper bound for theta
    //     $damping = 1.0;         // Optionally adjust damping (set less than 1.0 to be more cautious)
    
    //     for ($iteration = 0; $iteration < $maxIterations; $iteration++) {
    //         $numerator = 0.0;
    //         $denom = 0.0;
    
    //         // Calculate contributions from the observed responses (likelihood)
    //         foreach ($responses as $response) {
    //             $a = $response['discrimination']; // item discrimination parameter
    //             $b = $response['difficulty'];     // item difficulty parameter
    //             $isCorrect = $response['is_correct']; // student's response (1 for correct; 0 otherwise)
    
    //             // Logistic model: probability of a correct response P(θ)
    //             $pTheta = 1.0 / (1.0 + exp(-$a * ($theta - $b)));
    //             $qTheta = 1.0 - $pTheta;
    
    //             // Gradient (first derivative) and curvature (second derivative)
    //             $numerator += $a * ($isCorrect - $pTheta);
    //             $denom += $a * $a * $pTheta * $qTheta;
    //         }
    
    //         // Incorporate the prior: subtract the gradient from the prior and add to the hessian.
    //         // The priorWeight allows you to control how strongly the prior influences the update.
    //         $numerator -= $priorWeight * ($theta - $priorMean) / $priorVariance;
    //         $denom += $priorWeight * (1 / $priorVariance);
    
    //         // Avoid division by a near-zero denominator.
    //         if (abs($denom) < 1e-6) {
    //             \Log::warning("Denominator too small in Newton update; breaking from iterations.");
    //             break;
    //         }
    
    //         $update = $numerator / $denom;
    //         // Newton-Raphson update step (note: the sign is adjusted because our numerator comes from the log-posterior gradient)
    //         $theta += $damping * $update;
    
    //         // Clamp theta to its allowed range.
    //         $theta = max($thetaMin, min($thetaMax, $theta));
    
    //         // Convergence check
    //         if (abs($update) < $tolerance) {
    //             break;
    //         }
    //     }
    //     return $theta;
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

    // public function calculatePriorDistribution(array $theta_scores, int $minAssessments = 10, float $defaultMean = 0.0, float $defaultVariance = 0.5)
    // {
    //     $count = count($theta_scores);
    //     \Log::info("Calculating prior distribution for {$count} theta scores.");

    //     if ($count < $minAssessments) {
    //         return [
    //             'mean' => $defaultMean,
    //             'variance' => $defaultVariance,
    //         ];
    //     }

    //     // Calculate the mean of the theta scores
    //     $mean = array_sum($theta_scores) / $count;

    //     // Calculate the sample variance (with Bessel's correction)
    //     $sumOfSquares = 0.0;
    //     foreach ($theta_scores as $score) {
    //         $sumOfSquares += pow($score - $mean, 2);
    //     }
    //     $variance = $sumOfSquares / ($count - 1);
    //     $variance = min($variance, 2.0);
    //     // Ensure a minimum floor for variance, even if the number of assessments is sufficient
    //     $minVariance = 1e-6;
    //     if ($variance < $minVariance) {
    //         \Log::warning("Low prior variance detected. Adjusting to minimum floor.", [
    //             'original_variance' => $variance,
    //             'used_variance' => $minVariance
    //         ]);
    //         $variance = $minVariance;
    //     }

    //     return [
    //         'mean' => $mean,
    //         'variance' => $variance,
    //     ];
    // }

    // public function estimateThetaMAP(array $responses, float $initialTheta, float $priorMean = 0.0, float $priorVariance): float
    // {
    //     $theta = $initialTheta;
    //     $tolerance = 1e-5; // Convergence tolerance
    //     $maxIterations = 100; // Maximum number of iterations
    //     $thetaMin = -5.0; // Lower bound for theta
    //     $thetaMax = 5.0;  // Upper bound for theta

    //     for ($iteration = 0; $iteration < $maxIterations; $iteration++) {
    //         $numerator = 0.0;
    //         $denominator = 0.0;

    //         foreach ($responses as $response) {
    //             $a = $response['discrimination']; // Item discrimination (a_i)
    //             $b = $response['difficulty'];     // Item difficulty (b_i)
    //             $isCorrect = $response['is_correct']; // Student's response (1 for correct, 0 for incorrect)

    //             // Calculate the probability of a correct answer using the logistic function (P(theta))
    //             $pTheta = 1 / (1 + exp(-$a * ($theta - $b))); // P(\theta)
    //             $qTheta = 1 - $pTheta; // Q(\theta)

    //             // Likelihood (gradient and Hessian)
    //             $numerator += $a * ($isCorrect - $pTheta); // First derivative (gradient)
    //             $denominator += $a * $a * $pTheta * $qTheta; // Second derivative (Hessian)
    //         }

    //         // Add the prior term to the numerator and denominator for MAP update
    //         $numerator -= ($theta - $priorMean) / $priorVariance; // Gradient term from prior
    //         $denominator += 1 / $priorVariance; // Hessian term from prior

    //         // Check for zero denominator (to avoid division by zero)
    //         if (abs($denominator) < 1e-6) {
    //             break; // Avoid division by zero or very small denominator
    //         }

    //         // Newton-Raphson update (adjusted with prior)
    //         $theta += $numerator / $denominator;

    //         // Clamp theta to be within the range [-5, 5]
    //         $theta = max($thetaMin, min($thetaMax, $theta));

    //         // Check for convergence based on the change in theta (gradient)
    //         if (abs($numerator / $denominator) < $tolerance) {
    //             break;
    //         }
    //     }

    //     return $theta;
    // }


    public function initializeThetaForStudent(Student $student)
    {
        $courses = Course::all();

        if ($courses->isNotEmpty()) {
            $data = $courses->map(fn($course) => [
                'student_id' => $student->student_id,
                'course_id' => $course->course_id,
                'theta_score' => 0.0,
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray();

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
