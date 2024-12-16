<?php

namespace App\Services;

use App\Models\AssessmentCourse;
use App\Models\Question;
use App\Models\Student;

class QuestionService
{
    protected $itemSelectionService;
    public function __construct(ItemSelectionService $itemSelectionService)
    {
        $this->itemSelectionService = $itemSelectionService;
    }
    public function selectFirstQuestion(AssessmentCourse $assessmentCourses, Student $student)
    {
        try {
            $courseIds = $assessmentCourses->pluck('course_id')->toArray();

            // Get available questions
            $availableQuestions = Question::whereIn('course_id', $courseIds)
                ->with(['question_detail', 'course'])
                ->get();

            // Format questions for item selection
            $items = $availableQuestions->map(function ($question) {
                return [
                    'id' => $question->question_id,
                    'a' => $question->discrimination_index ?? 1.0,
                    'b' => $question->difficulty_value ?? 0.0,
                    'course' => $question->course_id,
                    'question' => $question
                ];
            })->toArray();

            // Select first course (you might want to implement a specific course selection strategy)
            $firstCourse = $courseIds[0];

            // Get optimal first question
            $selectedItem = $this->itemSelectionService->getMaximumItemByCourse(
                $initialTheta,
                $firstCourse,
                $items
            );

            if (!$selectedItem) {
                return $availableQuestions->random();
            }

            Log::info("First question ", [
                'initial_theta' => $initialTheta,
                'course_id' => $firstCourse,
                'question' => $items
            ]);

            return Question::find($selectedItem['id']);

        } catch (\Exception $e) {
            Log::error('Error in selectFirstQuestion: ' . $e->getMessage());
            // Fallback to random selection
            return Question::whereIn('course_id', $courseIds)
                ->with(['question_detail', 'course'])
                ->inRandomOrder()
                ->first();
        }
    }
}
