<?php

namespace App\Services;

use App\Models\AssessmentItem;
use App\Models\AssessmentCourse;
use App\Models\Question;

class ItemAnalysisService
{
    public function analyze()
    {
        $questions = Question::all();

        foreach ($questions as $question) {
            $difficultyValue = $this->calculateDifficulty($question);
            $discriminationIndex = $this->calculateDiscrimination($question);

            // Recalibrate difficulty type
            $difficultyType = $this->recalibrateDifficultyType($difficultyValue);

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
        $correctAttempts = AssessmentItem::where('question_id', $question->question_id)
            ->whereHas('question', function ($query) {
                $query->whereColumn('assessment_items.participant_answer', 'questions.answer');
            })
            ->count();

        return $totalAttempts > 0 ? round($correctAttempts / $totalAttempts, 2) : 0;
    }

    private function calculateDiscrimination(Question $question)
    {
        $assessments = AssessmentCourse::orderBy('final_theta_score', 'desc')->get();
        $totalCount = $assessments->count();
        $topCount = round($totalCount * 0.27);
        $bottomCount = $topCount;

        $topAssessments = $assessments->take($topCount);
        $bottomAssessments = $assessments->reverse()->take($bottomCount);

        $topCorrect = $this->calculateCorrectPercentage($topAssessments, $question->question_id);
        $bottomCorrect = $this->calculateCorrectPercentage($bottomAssessments, $question->question_id);

        return round($topCorrect - $bottomCorrect, 2);
    }

    private function calculateCorrectPercentage($assessments, $questionId)
    {
        $total = 0;
        $correct = 0;

        foreach ($assessments as $assessment) {
            $items = AssessmentItem::where('assessment_course_id', $assessment->assessment_course_id)
                ->where('question_id', $questionId)
                ->get();

            foreach ($items as $item) {
                $total++;
                if ($item->participant_answer == $item->question->answer) {
                    $correct++;
                }
            }
        }

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
