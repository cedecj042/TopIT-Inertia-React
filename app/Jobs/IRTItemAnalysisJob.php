<?php

namespace App\Jobs;

use App\Enums\ConvergenceStatus;
use App\Enums\JobStatus;
use App\Events\UploadEvent;
use App\Models\Question;
use App\Models\QuestionRecalibrationLog;
use App\Models\Recalibration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Models\RecalibrationResult;

class IRTItemAnalysisJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $recalibration_id;
    protected $questions;

    public function __construct($recalibration_id, $questions)
    {
        $this->recalibration_id = $recalibration_id;
        $this->questions = $questions;
    }

    public function handle()
    {
        $recalibration = Recalibration::find($this->recalibration_id);
        if (!$recalibration) {
            Log::error("Recalibration job failed: Invalid recalibration_id ({$this->recalibration_id})");
            return;
        }

        $recalibration->update(['status' => JobStatus::PROCESSING->value]);

        try {
            $questionLogs = [];
            $totalIterations = 0;
            $allConverged = true;
            $failedQuestions = [];

            foreach ($this->questions as $questionId => $questionData) {
                $responses = [];
                $thetas = [];

                if(count($questionData['assessment_items']) < 5){
                    continue;
                }

                foreach ($questionData['assessment_items'] as $item) {
                    $responses[] = $item['score'];
                    $thetas[] = $item['final_theta_score'];
                }

                $initialGuess = [
                    'a' => $questionData['discrimination_index'] ?? 1.0,
                    'b' => $questionData['difficulty_value'] ?? 0.0
                ];

                list($params, $stdErrors, $convergence) = $this->estimate2PLParameters($responses, $thetas, $initialGuess);

                if (!$convergence['success']) {
                    $allConverged = false;
                    $failedQuestions[] = $questionId;
                }

                $totalIterations += $convergence['iterations'];
                \Log::info(json_encode($stdErrors));

                if (!is_nan($params['a']) && !is_nan($params['b']) && !is_null($params['a']) && !is_null($params['b'])) {
                    $difficultyType = $this->getDifficultyType($params['b']);
                    $questionLogs[] = [
                        'recalibration_id' => $this->recalibration_id,
                        'question_id' => $questionId,
                        'new_difficulty_type' => $difficultyType,
                        'new_difficulty_value' => $params['b'],
                        'new_discrimination_index' => $params['a'],
                        'standard_error_difficulty' => is_nan($stdErrors['b']) || is_infinite($stdErrors['b']) ? null : $stdErrors['b'],
                        'standard_error_discrimination' => is_nan($stdErrors['a']) || is_infinite($stdErrors['a']) ? null : $stdErrors['a'],
                        'previous_difficulty_value' => $questionData['difficulty_value'],
                        'previous_discrimination_index' => $questionData['discrimination_index'],
                        'previous_difficulty_type' => $questionData['difficulty_type'],
                    ];
                    $question = Question::find($questionId);
                    $question->update([
                        'difficulty_value' => $params['b'],
                        'discrimination_index' => $params['a'],
                        'difficulty_type' => $difficultyType,
                    ]);
                } else {
                    Log::error("Failed to update question {$questionId}: Invalid parameters (a: {$params['a']}, b: {$params['b']})");
                    continue;
                }
            }

            $convergenceStatus = $allConverged ? ConvergenceStatus::ALL->value : ConvergenceStatus::SOME->value;

            if (!$allConverged) {
                Log::warning("Recalibration job completed with partial convergence. Failed questions: " . implode(", ", $failedQuestions));
            }
            if (!empty($questionLogs)) {
                QuestionRecalibrationLog::upsert($questionLogs, ['recalibration_id', 'question_id'], [
                    'new_difficulty_value',
                    'new_discrimination_index',
                    'new_difficulty_type',
                    'previous_difficulty_value',
                    'previous_discrimination_index',
                    'previous_difficulty_type',
                    'standard_error_difficulty',
                    'standard_error_discrimination',
                    'updated_at'
                ]);
                Log::info("Inserted recalibration logs for " . count($questionLogs) . " questions.");
            }
            $recalibration->update([
                'status' => JobStatus::SUCCESS->value,
                'total_question_logs' => count($questionLogs),
                'convergence_status' => $convergenceStatus,
                'total_iterations' => $totalIterations,
                'updated_at' => now(),
            ]);

            $this->broadcastEvent(null, "Recalibration job completed.", null);
            Log::info("Recalibration job completed with status SUCCESS.");

        } catch (\Exception $e) {
            Log::error("Recalibration job failed: " . $e->getMessage(), ['exception' => $e]);

            if ($recalibration) {
                $recalibration->update(['status' => JobStatus::FAILED->value]);
            }

            $this->broadcastEvent(null, null, "Recalibration job failed.");
        }
    }


    /**
     * Estimate 2PL parameters using custom optimization
     * 
     * @param array $responses Binary response data (0 or 1)
     * @param array $thetas Ability estimates for examinees
     * @param array $initialGuess Initial parameter values [a, b]
     * @return array Tuple of (parameters, standard_errors, convergence_info)
     */
    private function estimate2PLParameters($responses, $thetas, $initialGuess)
    {
        // Optimization parameters
        $maxIterations = 100;
        $tolerance = 1e-6;
        $learningRate = 0.1;

        $params = $initialGuess;
        $prevLoss = null; // Initialize to null instead of INF
        $iterations = 0;
        $converged = false;

        // Simple gradient descent implementation
        for ($i = 0; $i < $maxIterations; $i++) {
            // Calculate loss and gradient
            $loss = $this->logLikelihood2PL($params, $responses, $thetas);
            $gradient = $this->gradLogLikelihood2PL($params, $responses, $thetas);

            // Update parameters
            $params['a'] -= $learningRate * $gradient['a'];
            $params['b'] -= $learningRate * $gradient['b'];

            // Ensure discrimination is positive
            $params['a'] = max($params['a'], 0.1);

            // Check convergence
            if ($prevLoss !== null && abs($prevLoss - $loss) < $tolerance) {
                $converged = true;
                break;
            }
            $iterations++;
            $prevLoss = $loss;
        }

        // Calculate standard errors
        $hessian = $this->hessianLogLikelihood2PL($params, $responses, $thetas);

        // Invert Hessian to get variance-covariance matrix
        // Note: This is a simplified approach; you may want to use a linear algebra library
        $det = $hessian[0]['aa'] * $hessian[1]['bb'] - $hessian[0]['ab'] * $hessian[1]['ba'];

        if (abs($det) < 1e-10) {
            $stdErrors = [
                'a' => INF,
                'b' => INF
            ];
        } else {
            $vcov = [
                ['aa' => $hessian[1]['bb'] / $det, 'ab' => -$hessian[0]['ab'] / $det],
                ['ba' => -$hessian[1]['ba'] / $det, 'bb' => $hessian[0]['aa'] / $det]
            ];

            $stdErrors = [
                'a' => round(sqrt($vcov[0]['aa']), 2), // Round to 2 decimal places
                'b' => round(sqrt($vcov[1]['bb']), 2)  // Round to 2 decimal places
            ];
        }

        $convergenceInfo = [
            'success' => $converged,
            'message' => $converged ? 'Optimization converged.' : 'Maximum iterations reached without convergence.',
            'iterations' => $iterations
        ];
        $params['a'] = round($params['a'], 2);
        $params['b'] = round(min(max($params['b'], -5.0), 5.0), 2);

        return [$params, $stdErrors, $convergenceInfo];
    }


    /**
     * Calculate the probability of a correct response under the 2PL model
     * 
     * @param float $theta Ability parameter
     * @param float $a Discrimination parameter
     * @param float $b Difficulty parameter
     * @return float Probability of a correct response
     */
    private function probCorrect2PL($theta, $a, $b)
    {
        $z = $a * ($theta - $b);
        return 1.0 / (1.0 + exp(-$z));
    }

    /**
     * Calculate the log likelihood for the 2PL model
     * 
     * @param array $params [a, b] where a is discrimination and b is difficulty
     * @param array $responses Binary response data (0 or 1)
     * @param array $thetas Ability estimates for examinees
     * @return float Negative log likelihood (for minimization)
     */
    private function logLikelihood2PL($params, $responses, $thetas)
    {
        $a = $params['a'];
        $b = $params['b'];

        // Discrimination should be positive
        if ($a <= 0) {
            return INF;
        }

        $logLike = 0;

        for ($i = 0; $i < count($responses); $i++) {
            // Calculate probability
            $p = $this->probCorrect2PL($thetas[$i], $a, $b);

            // Avoid log(0) errors
            $p = max(min($p, 0.9999999), 0.0000001);

            // Add to log likelihood
            if ($responses[$i] == 1) {
                $logLike += log($p);
            } else {
                $logLike += log(1 - $p);
            }
        }

        // Return negative log likelihood for minimization
        return -$logLike;
    }

    /**
     * Calculate gradient of log likelihood for optimization
     * 
     * @param array $params [a, b] where a is discrimination and b is difficulty
     * @param array $responses Binary response data (0 or 1)
     * @param array $thetas Ability estimates for examinees
     * @return array Gradient [d_a, d_b]
     */
    private function gradLogLikelihood2PL($params, $responses, $thetas)
    {
        $a = $params['a'];
        $b = $params['b'];

        $d_a = 0;
        $d_b = 0;

        for ($i = 0; $i < count($responses); $i++) {
            $theta = $thetas[$i];
            $p = $this->probCorrect2PL($theta, $a, $b);

            // Gradient components
            $common = ($responses[$i] - $p);
            $d_a += $common * ($theta - $b);
            $d_b += $common * (-$a);
        }

        return [
            'a' => -$d_a,  // Negative because we're minimizing negative log likelihood
            'b' => -$d_b
        ];
    }

    /**
     * Calculate the Hessian matrix for standard error estimation
     * 
     * @param array $params [a, b] where a is discrimination and b is difficulty
     * @param array $responses Binary response data (0 or 1)
     * @param array $thetas Ability estimates for examinees
     * @return array 2x2 Hessian matrix
     */
    private function hessianLogLikelihood2PL($params, $responses, $thetas)
    {
        $a = $params['a'];
        $b = $params['b'];

        $hessian = [
            ['aa' => 0, 'ab' => 0],
            ['ba' => 0, 'bb' => 0]
        ];

        for ($i = 0; $i < count($responses); $i++) {
            $theta = $thetas[$i];
            $p = $this->probCorrect2PL($theta, $a, $b);

            // Second derivatives
            $d2_aa = ($theta - $b) * ($theta - $b) * $p * (1 - $p);
            $d2_bb = $a * $a * $p * (1 - $p);
            $d2_ab = ($theta - $b) * (-$a) * $p * (1 - $p);

            // Update Hessian
            $hessian[0]['aa'] += $d2_aa;
            $hessian[1]['bb'] += $d2_bb;
            $hessian[0]['ab'] += $d2_ab;
            $hessian[1]['ba'] += $d2_ab;
        }

        // Negative because we're minimizing negative log likelihood
        return [
            ['aa' => -$hessian[0]['aa'], 'ab' => -$hessian[0]['ab']],
            ['ba' => -$hessian[1]['ba'], 'bb' => -$hessian[1]['bb']]
        ];
    }

    public function broadcastEvent($info = null, $success = null, $error = null)
    {
        Log::info('starting the event');
        broadcast(new UploadEvent($info, $success, $error));
        Log::info('Event broadcasted');
    }
    private function getDifficultyType($difficultyValue)
    {
        if ($difficultyValue >= 3.0) {
            return 'Very Easy';
        } elseif ($difficultyValue >= 1.0) {
            return 'Easy';
        } elseif ($difficultyValue >= -1.0) {
            return 'Average';
        } elseif ($difficultyValue >= -3.0) {
            return 'Hard';
        } else {
            return 'Very Hard';
        }
    }
}
