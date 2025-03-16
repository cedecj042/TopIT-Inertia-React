<?php

namespace App\Services;

use App\Models\Assessment;
use App\Models\AssessmentCourse;
use App\Models\AssessmentItem;
use App\Models\Question;
use App\Models\Student;
use App\Models\StudentCourseTheta;
use App\Models\ThetaScoreLog;
use Log;

class QuestionService
{
    protected $itemSelectionService;
    protected $terminationRuleService;

    public function __construct(ItemSelectionService $itemSelectionService, TerminationRuleService $terminationRuleService)
    {
        $this->itemSelectionService = $itemSelectionService;
        $this->terminationRuleService = $terminationRuleService;
    }

    public function selectQuestion(Assessment $assessment)
    {
        try {
            // Filter eligible courses (courses with fewer than 5 questions answered)
            $eligibleCourses = $assessment->assessment_courses->reject(function ($course) {
                return $course->assessment_items->count() >= 5;
            });

            // Check if no eligible courses are left
            if ($eligibleCourses->isEmpty()) {
                Log::info("All courses have reached their max question limit.");
                return null;
            }

            // Randomly pick an eligible course
            $randomCourse = $eligibleCourses->shuffle()->first();

            // Check for an existing unanswered assessment item
            $existingAssessmentItem = $randomCourse->assessment_items()
                ->whereNull('participants_answer') // Check for unanswered items
                ->with(['question.question_detail', 'assessment_course.assessment'])
                ->first();

            if ($existingAssessmentItem) {
                Log::info("Returning existing unanswered question.", [
                    'assessment_item_id' => $existingAssessmentItem->assessment_item_id
                ]);
                return $existingAssessmentItem;
            }

            // Get the latest theta score
            $currentTheta = $randomCourse->theta_score_logs
                ->sortByDesc('created_at')
                ->first()?->new_theta_score ?? $randomCourse->initial_theta_score ?? 0.0;

            // Retrieve answered question IDs
            $answeredQuestions = $randomCourse->assessment_items->pluck('question_id')->toArray();

            // Retrieve available questions
            $availableQuestions = Question::where('course_id', $randomCourse->course_id)
                ->whereNotIn('question_id', $answeredQuestions)
                ->with(['question_detail', 'course'])
                ->get();

            if ($availableQuestions->isEmpty()) {
                Log::info("No available questions for course {$randomCourse->course_id}.");
                return null;
            }

            // Format questions for item selection
            $items = $availableQuestions->map(function ($question) {
                return [
                    'id' => $question->question_id,
                    'a' => $question->discrimination_index ?? 1.0,
                    'b' => $question->difficulty_value ?? 0.0,
                    'course' => $question->course_id,
                    'type' => $question->question_detail->type,
                    'question' => $question,
                ];
            })->toArray();

            // Select the optimal question using the CAT algorithm
            $selectedItem = $this->itemSelectionService->getMaximumItemByCourse(
                $currentTheta,
                $randomCourse->course_id,
                $items
            );

            // Create the new assessment item
            $assessmentItem = AssessmentItem::create([
                'assessment_course_id' => $randomCourse->assessment_course_id,
                'question_id' => $selectedItem['id'],
                'participants_answer' => null,
                'score' => 0,
            ]);

            // Eager load relationships
            $assessmentItem->load(['question.question_detail']);

            Log::info("New question selected for assessment:", [
                'assessment_item_id' => $assessmentItem->assessment_item_id,
                'question_id' => $selectedItem['id'],
                'course_id' => $randomCourse->course_id,
                'theta' => $currentTheta,
            ]);

            return $assessmentItem;
        } catch (\Exception $e) {
            Log::error('Error in selectQuestion:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return null;
        }
    }

}
