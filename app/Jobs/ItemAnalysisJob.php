<?php

namespace App\Jobs;

use App\Models\AssessmentItem;
use App\Models\AssessmentCourse;
use App\Models\Question;
use App\Models\QuestionRecalibrationLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;

class ItemAnalysisJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */

    public $tries = 1;
    public function handle()
    {
        $validQuestionIds = AssessmentItem::select('question_id')
            ->groupBy('question_id')
            ->havingRaw('COUNT(*) > 5')
            ->pluck('question_id');

        $questions = Question::whereIn('question_id', $validQuestionIds)
            ->get();

        foreach ($questions as $question) {
            $difficultyValue = $this->calculateDifficulty($question);
            $discriminationIndex = $this->calculateDiscrimination($question);

            $difficultyType = $this->recalibrateDifficultyType($difficultyValue);

            if (
                $difficultyValue === $question->difficulty_value &&
                $discriminationIndex === $question->discrimination_index &&
                $difficultyType === $question->difficulty_type
            ) {
                \Log::info("Skipping Question ID {$question->question_id} - No changes detected.");
                continue;
            }

            QuestionRecalibrationLog::create([
                'question_id' => $question->question_id,
                'previous_difficulty_value' => $question->difficulty_value,
                'previous_discrimination_index' => $question->discrimination_index,
                'previous_difficulty_type' => $question->difficulty_type,
                'new_difficulty_value' => $difficultyValue,
                'new_discrimination_index' => $discriminationIndex,
                'new_difficulty_type' => $difficultyType,
                'created_at'=> now(),
                'updated_at'=> now(),
            ]);
            
            // Update question record
            $question->update([
                'difficulty_value' => $difficultyValue,
                'discrimination_index' => $discriminationIndex,
                'difficulty_type' => $difficultyType,
            ]);

            
        }
    }

    private function calculateDifficulty(Question $question)
    {
        $totalAttempts = AssessmentItem::where('question_id', $question->question_id)->count();

        if ($totalAttempts < 5) {
            return null;
        }

        $correctAttempts = AssessmentItem::where('question_id', $question->question_id)
            ->where('score', '>', 0)
            ->count();

        return round($correctAttempts / $totalAttempts, 2);
    }

    private function calculateDiscrimination(Question $question)
    {
        $assessments = AssessmentCourse::orderBy('final_theta_score', 'desc')->get();
        $totalCount = $assessments->count();
        $topCount = round($totalCount * 0.27);
        $bottomCount = $topCount;

        $topAssessments = $assessments->take($topCount);
        $bottomAssessments = $assessments->slice(-$bottomCount);

        $topCorrect = $this->calculateCorrectPercentage($topAssessments, $question->question_id);
        $bottomCorrect = $this->calculateCorrectPercentage($bottomAssessments, $question->question_id);

        return round($topCorrect - $bottomCorrect, 2);
    }

    private function calculateCorrectPercentage($assessments, $questionId)
    {
        $assessmentCourseIds = $assessments->pluck('assessment_course_id');

        $total = AssessmentItem::whereIn('assessment_course_id', $assessmentCourseIds)
            ->where('question_id', $questionId)
            ->count();

        $correct = AssessmentItem::whereIn('assessment_course_id', $assessmentCourseIds)
            ->where('question_id', $questionId)
            ->where('score', '>', 0)
            ->count();

        return $total > 0 ? round($correct / $total, 2) : 0;
    }

    private function recalibrateDifficultyType($difficultyValue)
    {
        if ($difficultyValue > 0.85) {
            return 'Very Easy';
        } elseif ($difficultyValue >= 0.71) {
            return 'Easy';
        } elseif ($difficultyValue >= 0.31) {
            return 'Average';
        } elseif ($difficultyValue >= 0.16) {
            return 'Hard';
        } else {
            return 'Very Hard';
        }
    }
    public function middleware()
    {
        return [new WithoutOverlapping()];
    }
}
