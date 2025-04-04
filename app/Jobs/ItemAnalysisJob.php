<?php

namespace App\Jobs;

use App\Enums\JobStatus;
use App\Events\UploadEvent;
use App\Models\AssessmentItem;
use App\Models\AssessmentCourse;
use App\Models\Question;
use App\Models\QuestionRecalibrationLog;
use App\Models\Recalibration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class ItemAnalysisJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;
    protected $recalibration_id;

    public function __construct(int $recalibration_id)
    {
        $this->recalibration_id = $recalibration_id;
    }

    public function handle()
    {
        $recalibration = Recalibration::find($this->recalibration_id);
        if (!$recalibration)
            return;

        $recalibration->status = JobStatus::PROCESSING->value;
        $recalibration->save();

        try {
            $validQuestionIds = AssessmentItem::select('question_id')
                ->groupBy('question_id')
                ->havingRaw('COUNT(*) > 5')
                ->pluck('question_id');

            $assessmentItems = AssessmentItem::whereIn('question_id', $validQuestionIds)
                ->select('question_id', 'score', 'assessment_course_id', 'previous_theta_score')
                ->get()
                ->groupBy('question_id');

            $questions = Question::whereIn('question_id', $validQuestionIds)->get();
            $logs = [];

            foreach ($questions as $question) {
                Log::info("Processing question ID: {$question->question_id}");

                $difficultyValue = $this->calculateDifficulty($assessmentItems[$question->question_id] ?? collect());
                if ($difficultyValue === null) {
                    continue;
                }
                $discriminationIndex = $this->calculateDiscrimination($question->question_id, $assessmentItems);
                $difficultyType = $this->recalibrateDifficultyType($difficultyValue);

                Log::info("Question ID: {$question->question_id}, Difficulty: $difficultyValue, Discrimination: $discriminationIndex, Type: $difficultyType");

                if (
                    $difficultyValue === $question->difficulty_value &&
                    $discriminationIndex === $question->discrimination_index &&
                    $difficultyType === $question->difficulty_type
                ) {
                    continue;
                }

                $logs[] = [
                    'recalibration_id' => $this->recalibration_id,
                    'question_id' => $question->question_id,
                    'previous_difficulty_value' => $question->difficulty_value,
                    'previous_discrimination_index' => $question->discrimination_index,
                    'previous_difficulty_type' => $question->difficulty_type,
                    'new_difficulty_value' => $difficultyValue,
                    'new_discrimination_index' => $discriminationIndex,
                    'new_difficulty_type' => $difficultyType,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                Log::info("Updating question ID {$question->question_id} with values:", [
                    'difficulty_value' => $difficultyValue,
                    'discrimination_index' => $discriminationIndex,
                    'difficulty_type' => $difficultyType,
                ]);
                $question->update([
                    'difficulty_value' => $difficultyValue,
                    'discrimination_index' => $discriminationIndex,
                    'difficulty_type' => $difficultyType,
                ]);
            }

            if (!empty($logs)) {
                QuestionRecalibrationLog::upsert($logs, ['recalibration_id', 'question_id'], [
                    'new_difficulty_value',
                    'new_discrimination_index',
                    'new_difficulty_type',
                    'updated_at'
                ]);
                Log::info("Inserted recalibration logs for " . count($logs) . " questions.");
            }

            $recalibration->update([
                'status' => JobStatus::SUCCESS->value,
                'total_question_logs' => count($logs)
            ]);
            $this->broadcastEvent(null, "Recalibration job completed.", null);
            Log::info("Recalibration job completed with status SUCCESS.");

        } catch (\Exception $e) {
            $this->broadcastEvent(null, null, "Recalibration job failed.");
            Log::error("Recalibration job failed: " . $e->getMessage(), ['exception' => $e]);
            $recalibration->update(['status' => JobStatus::FAILED->value]);
        }
    }

    private function calculateDifficulty($assessmentItems)
    {
        Log::info("Calculating difficulty: " . json_encode($assessmentItems));

        $totalAttempts = $assessmentItems->count();
        if ($totalAttempts < 5) {
            Log::warning("Skipping difficulty calculation: Less than 5 attempts.");
            return null;
        }

        $thetaScores = $assessmentItems->pluck('previous_theta_score')->toArray();
        $correctAttempts = $assessmentItems->where('score', '>', 0)->count();
        $p = $correctAttempts / $totalAttempts;

        if ($totalAttempts < 30) {
            $p = ($correctAttempts + 1) / ($totalAttempts + 2); 
        } else {
            $p = ($correctAttempts + 0.5) / ($totalAttempts + 1); 
        }

        $meanTheta = array_sum($thetaScores) / count($thetaScores);
        $difficulty = -log((1 - $p) / $p) + $meanTheta;
        return round(max(-5, min(5, $difficulty)), 2);
    }



    private function calculateDiscrimination($question_id, $assessmentItems)
    {
        Log::info("Calculating discrimination");

        try {
            $items = $assessmentItems[$question_id] ?? collect();
            $scores = $items->pluck('previous_theta_score')->toArray();
            $correctResponses = $items->pluck('score')->map(fn($score) => $score > 0 ? 1 : 0)->toArray();
            return $this->pearsonCorrelation($scores, $correctResponses);
        } catch (\Exception $e) {
            Log::error("Error calculating discrimination: " . $e->getMessage());
            return null;
        }
    }


    private function pearsonCorrelation($x, $y)
    {
        $n = count($x);
        if ($n == 0)
            return 0;

        $meanX = array_sum($x) / $n;
        $meanY = array_sum($y) / $n;
        $num = 0;
        $denomX = 0;
        $denomY = 0;

        for ($i = 0; $i < $n; $i++) {
            $dx = $x[$i] - $meanX;
            $dy = $y[$i] - $meanY;
            $num += $dx * $dy;
            $denomX += $dx ** 2;
            $denomY += $dy ** 2;
        }

        return $denomX * $denomY == 0 ? 0 : round($num / sqrt($denomX * $denomY), 2);
    }
    private function recalibrateDifficultyType($difficultyValue)
    {
        if ($difficultyValue === null)
            return null;
        return match (true) {
            $difficultyValue >= 3.0 => 'Very Hard',
            $difficultyValue >= 1.0 => 'Hard',
            $difficultyValue >= -1.0 => 'Average',
            $difficultyValue >= -3.0 => 'Easy',
            default => 'Very Easy',
        };
    }
    public function failed(Throwable $exception)
    {
        // Handle recalibration logic here
        $this->updateRecalibration();

        // Optionally log the error
        \Log::error('Job failed: ' . $exception->getMessage());
    }
    private function updateRecalibration()
    {
        $recalibration = Recalibration::where('status', JobStatus::PROCESSING->value)->get();
        $recalibration->update(['status' => JobStatus::FAILED->value]);
    }
    public function broadcastEvent($info = null, $success = null, $error = null)
    {
        Log::info('starting the event');
        broadcast(new UploadEvent($info, $success, $error));
        Log::info('Event broadcasted');
    }
}
