<?php

namespace App\Services;

use App\Models\Question;
use App\Models\Student;

class AssessmentService
{
    public function getNextQuestion(Student $student)
    {
        $theta = $student->current_theta; // Assuming there's a method to get the current theta
        $questions = Question::whereDoesntHave('responses', function ($query) use ($student) {
            $query->where('student_id', $student->id); // Filter out questions already answered
        })->get();

        return $this->selectQuestionWithHighestInformation($questions, $theta);
    }

    protected function selectQuestionWithHighestInformation($questions, $theta)
    {
        $bestQuestion = null;
        $maxInformation = 0;

        foreach ($questions as $question) {
            $information = $this->itemInformation($theta, $question->discrimination_index, $question->difficulty);
            if ($information > $maxInformation) {
                $maxInformation = $information;
                $bestQuestion = $question;
            }
        }

        return $bestQuestion;
    }

    private function itemInformation($theta, $a, $b)
    {
        $P = 1 / (1 + exp(-$a * ($theta - $b)));
        $Q = 1 - $P;
        return $a * $a * $P * $Q;
    }
}
