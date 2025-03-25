<?php

namespace App\Services;

use App\Models\AssessmentItem;
use App\Models\Question;
use Illuminate\Support\Str; // Laravel string helper for pluralization/singularization

class ScoringService
{
    public function checkAnswer($question_id, $participants_answer): int
    {
        if (empty($participants_answer)) {
            return 0;
        }
        $question = Question::findOrFail($question_id);
        $correctAnswer = json_decode($question->answer, true);
        switch ($question->question_type) {
            case 'Multiple Choice - Single':
                return $this->scoreMultipleChoiceSingle($participants_answer, $correctAnswer);

            case 'Multiple Choice - Many':
                return $this->scoreMultipleChoiceMany($participants_answer, $correctAnswer);

            case 'Identification':
                return $this->scoreIdentification($participants_answer, $correctAnswer);

            default:
                return 0;
        }
    }

    private function scoreMultipleChoiceSingle($participantsAnswer, $correctAnswer): int
    {
        $participantText = is_array($participantsAnswer) ? $participantsAnswer[0] : $participantsAnswer;
        $correctText = is_array($correctAnswer) ? $correctAnswer[0] : $correctAnswer;

        $participantText = $this->normalizeAnswer($participantText);
        $correctText = $this->normalizeAnswer($correctText);

        return $participantText === $correctText ? 1 : 0;
    }

    private function normalizeAnswer($answer): string
    {
        $answer = strtolower(trim((string) $answer));
        return preg_replace('/\s+/', ' ', $answer);
    }

    private function scoreMultipleChoiceMany(array $participantsAnswer, array $correctAnswer): int
    {
        sort($participantsAnswer);
        sort($correctAnswer);

        return $participantsAnswer === $correctAnswer ? 1 : 0;
    }

    private function scoreIdentification($participantsAnswer, $correctAnswer): int
    {
        $participantText = is_array($participantsAnswer) ? $participantsAnswer[0] : $participantsAnswer;
        $correctKeywords = is_array($correctAnswer) ? $correctAnswer : [$correctAnswer];

        $participantText = $this->normalizeAnswer($participantText);

        foreach ($correctKeywords as $keyword) {
            $keyword = $this->normalizeAnswer($keyword);

            if ($this->areFormsEquivalent($participantText, $keyword)) {
                return 1;
            }
        }

        return 0;
    }

    private function areFormsEquivalent(string $word1, string $word2): bool
    {
        // Normalize input
        $word1 = $this->normalizeAnswer($word1);
        $word2 = $this->normalizeAnswer($word2);

        // Compare singular and plural forms
        return Str::singular($word1) === Str::singular($word2)
            || Str::plural($word1) === Str::plural($word2)
            || $word1 === $word2;
    }

    private function containsKeyword(string $text, string $keyword): bool
    {
        // Check if the keyword exists as a substring in the text
        return str_contains($text, $keyword);
    }

    private function validateAnswers($participantsAnswer, $correctAnswer): bool
    {
        return isset($participantsAnswer, $correctAnswer) && is_array($correctAnswer);
    }
}
