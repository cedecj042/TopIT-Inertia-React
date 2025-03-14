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
        // Ensure both arrays are identical
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

            // Check for singular/plural equivalence first
            if ($this->areFormsEquivalent($participantText, $keyword)) {
                return 1; // Match found
            }

            // Check for keyword as a substring
            if ($this->containsKeyword($participantText, $keyword)) {
                return 1; // Match found
            }
        }

        return 0; // No match
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
