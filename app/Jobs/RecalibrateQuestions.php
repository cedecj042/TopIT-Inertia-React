<?php

namespace App\Jobs;

use App\Models\Question;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class RecalibrateQuestions implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Fetch all questions with their assessment item data
        $questions = Question::with('assessmentItems')->get();

        foreach ($questions as $question) {
            $total_responses = $question->assessmentItems->count();

            if ($total_responses > 0) {
                $correct_responses = $question->assessmentItems->where('score', '>', 0)->count();
                $difficulty_value = $this->calculateDifficultyValue($correct_responses, $total_responses);

                // Calculate discrimination index
                $discrimination_index = $this->calculateDiscriminationIndex($question, $total_responses);

                // Ensure discrimination index is within the valid range
                if ($discrimination_index < 0.5 || $discrimination_index > 2.0) {
                    $discrimination_index = null; // Flag invalid discrimination indices for review
                }

                // Update the question and log recalibration
                DB::transaction(function () use ($question, $difficulty_value, $discrimination_index) {
                    DB::table('question_recalibration_logs')->insert([
                        'question_id' => $question->id,
                        'previous_difficulty_value' => $question->difficulty_value,
                        'new_difficulty_value' => $difficulty_value,
                        'previous_discrimination_index' => $question->discrimination_index,
                        'new_discrimination_index' => $discrimination_index,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $question->update([
                        'difficulty_value' => $difficulty_value,
                        'discrimination_index' => $discrimination_index,
                        'difficulty_type' => $this->getDifficultyType($difficulty_value),
                    ]);
                });
            }
        }
    }

    /**
     * Calculate difficulty value.
     */
    private function calculateDifficultyValue(int $correct_responses, int $total_responses): float
    {
        // Scale to the -5 to 5 range
        $raw_difficulty = 1 - ($correct_responses / $total_responses); // Inverse of correctness ratio
        return ($raw_difficulty * 10) - 5; // Scale to -5 to 5
    }

    /**
     * Calculate discrimination index.
     */
    private function calculateDiscriminationIndex($question, int $total_responses): ?float
    {
        $upper_group = $question->assessmentItems()->orderByDesc('score')->take(ceil($total_responses * 0.27))->get();
        $lower_group = $question->assessmentItems()->orderBy('score')->take(ceil($total_responses * 0.27))->get();

        if ($upper_group->isEmpty() || $lower_group->isEmpty()) {
            return null; // Insufficient data
        }

        $upper_avg = $upper_group->avg('score');
        $lower_avg = $lower_group->avg('score');

        return $upper_avg - $lower_avg; // Difference in averages
    }

    /**
     * Map difficulty value to difficulty type.
     */
    private function getDifficultyType(float $value): string
    {
        if ($value <= -5) return 'Very Easy';
        if ($value <= -3) return 'Easy';
        if ($value <= -1) return 'Average';
        if ($value <= 1) return 'Average';
        if ($value <= 3) return 'Hard';
        return 'Very Hard';
    }
}
