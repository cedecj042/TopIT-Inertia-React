<?php

namespace App\Services;

use App\Models\AssessmentItem;
use App\Models\AssessmentCourse;
use App\Models\Question;

class ItemAnalysisService
{
    public function analyze()
    {
        $validQuestionIds = AssessmentItem::select('question_id')
            ->groupBy('question_id')
            ->havingRaw('COUNT(*) > 10')
            ->pluck('question_id'); 

        $questions = Question::whereIn('question_id', $validQuestionIds)->get();


        foreach ($questions as $question) {

            $difficultyValue = $this->calculateDifficulty($question);
            $discriminationIndex = $this->calculateDiscrimination($question);

            // Recalibrate difficulty type
            $difficultyType = $this->recalibrateDifficultyType($difficultyValue);

            // Update question record
            // $question->update([
            //     'difficulty_value' => $difficultyValue,
            //     'discrimination_index' => $discriminationIndex,
            //     'difficulty_type' => $difficultyType,
            // ]);

            \Log::info("Recalibrated Question ID: {$question->question_id}", [
                'difficulty_value' => $difficultyValue,
                'discrimination_index' => $discriminationIndex,
                'difficulty_type' => $difficultyType,
            ]);
        }
    }

    private function calculateDifficulty(Question $question)
    {
        $totalAttempts = AssessmentItem::where('question_id', $question->question_id)->count();

        // Skip calculation if attempts are less than 10
        if ($totalAttempts < 10) {
            \Log::info("Skipping Question ID {$question->question_id} due to low response count.");
            return null;
        }

        $correctAttempts = AssessmentItem::where('question_id', $question->question_id)
            ->where('score', '>', 0)
            ->count();

        \Log::info("Difficulty calculation: {$question->question_id}", [
            'total_attempts' => $totalAttempts,
            'correct_attempts' => $correctAttempts
        ]);

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
        \Log::info("Discirmination calculation: {$question->id}", [
            'top_correct' => $topCorrect,
            'bottom_correct' => $bottomCorrect
        ]);
        return round($topCorrect - $bottomCorrect, 2);
    }

    private function calculateCorrectPercentage($assessments, $questionId)
    {
        $assessmentCourseIds = $assessments->pluck('assessment_course_id'); // Get relevant course IDs

        $total = AssessmentItem::whereIn('assessment_course_id', $assessmentCourseIds)
            ->where('question_id', $questionId)
            ->count();

        $correct = AssessmentItem::whereIn('assessment_course_id', $assessmentCourseIds)
            ->where('question_id', $questionId)
            ->where('score', '>', 0) // Check correctness via score
            ->count();
        // \Log::info("Correct Percentage calculation: {$questionId}", [
        //     'total' => $total,
        //     'correct' => $correct
        // ]);
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
}
