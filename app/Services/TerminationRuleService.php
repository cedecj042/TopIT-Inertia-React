<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use App\Models\Assessment;
use App\Models\AssessmentItem;

class TerminationRuleService
{
    /**
     * Maximum number of questions in the test
     */
    public const MAX_QUESTIONS = 3;

    /**
     * Check if the test should terminate
     * 
     * @param Assessment $assessment
     * @return bool
     */
    // public function shouldTerminateTest(Assessment $assessment): bool
    // {
    //     // Check if total items have reached the maximum
    //     $totalItems = AssessmentItem::where(
    //         'assessment_course_id',
    //         $assessment->assessment_courses()->first()->assessment_course_id
    //     )->count();

    //     Log::info('CAT Termination Check', [
    //         'total_items' => $totalItems,
    //         'max_questions' => self::MAX_QUESTIONS
    //     ]);

    //     return $totalItems >= self::MAX_QUESTIONS;
    // }
    public function shouldTerminateTest(Assessment $assessment): bool
    {
        // Define the maximum number of questions allowed per course
        $maxQuestionsPerCourse = self::MAX_QUESTIONS;

        // Check each assessment_course to see if they have reached the max limit
        $allCoursesTerminated = $assessment->assessment_courses->every(function ($course) use ($maxQuestionsPerCourse) {
            return $course->assessment_items->count() >= $maxQuestionsPerCourse;
        });

        // Log the termination check details
        Log::info('CAT Termination Check', [
            'assessment_id' => $assessment->assessment_id,
            'all_courses_terminated' => $allCoursesTerminated,
            'max_questions_per_course' => $maxQuestionsPerCourse,
        ]);

        return $allCoursesTerminated;
    }


    /**
     * Get termination reason
     * 
     * @return string
     */
    public function getTerminationReason(): string
    {
        return "Maximum number of questions {$this->MAX_QUESTIONS} reached.";
    }
}