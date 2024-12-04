<?php

namespace App\Services;

use App\Models\AssessmentItem;
use App\Models\Question;
use Illuminate\Support\Str; // Laravel string helper for pluralization/singularization

class ScoringService
{
    public function checkAnswer(AssessmentItem $item): int
    {
        $question = Question::with(['question_detail'])->findOrFail($item->question_id);
        $participantsAnswer = json_decode($item->participants_answer, true);
        $correctAnswer = json_decode($question->question_detail->answer, true); // Array of possible answers

        switch ($question->question_detail->type) {
            case 'Multiple Choice - Single':
                return $this->scoreMultipleChoiceSingle($participantsAnswer, $correctAnswer);
            
            case 'Multiple Choice - Many':
                return $this->scoreMultipleChoiceMany($participantsAnswer, $correctAnswer);

            case 'Identification':
                return $this->scoreIdentification($participantsAnswer, $correctAnswer);

            default:
                return 0;
        }
    }

    private function scoreMultipleChoiceSingle($participantsAnswer, $correctAnswer): int
    {
        return $participantsAnswer === $correctAnswer ? 1 : 0;
    }

    private function scoreMultipleChoiceMany(array $participantsAnswer, array $correctAnswer): int
    {
        // Ensure both arrays are identical
        sort($participantsAnswer);
        sort($correctAnswer);

        return $participantsAnswer === $correctAnswer ? 1 : 0;
    }

    private function scoreIdentification(string $participantsAnswer, array $correctAnswer): int
    {
        // Normalize participant's answer and correct answers (case-insensitive)
        $normalizedAnswer = strtolower(trim($participantsAnswer));
        $normalizedCorrectAnswers = array_map('strtolower', array_map('trim', $correctAnswer));

        // Check for exact match
        if (in_array($normalizedAnswer, $normalizedCorrectAnswers)) {
            return 1;
        }

        // Singular/Plural Match
        foreach ($normalizedCorrectAnswers as $correct) {
            if ($this->areFormsEquivalent($normalizedAnswer, $correct)) {
                return 1;
            }
        }

        return 0; // No match
    }
    private function areFormsEquivalent(string $word1, string $word2): bool
    {
        // Compare singular and plural forms
        return Str::singular($word1) === Str::singular($word2) || Str::plural($word1) === Str::plural($word2);
    }
    private function validateAnswers($participantsAnswer, $correctAnswer): bool
{
    return isset($participantsAnswer, $correctAnswer) && is_array($correctAnswer);
}
}
