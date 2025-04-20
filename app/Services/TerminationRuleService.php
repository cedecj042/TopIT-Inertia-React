<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use App\Models\Assessment;
use App\Models\AssessmentItem;

class TerminationRuleService
{
    public const MAX_QUESTIONS = 10;
    public const MAX_QUESTIONS_TOTAL = 12; 
    public function shouldTerminateTest(Assessment $assessment): bool
    {
        $maxQuestionsPerCourse = self::MAX_QUESTIONS;

        $allCoursesTerminated = $assessment->assessment_courses->every(function ($course) use ($maxQuestionsPerCourse) {
            return $course->assessment_items->count() >= $maxQuestionsPerCourse;
        });

        Log::info('CAT Termination Check', [
            'assessment_id' => $assessment->assessment_id,
            'all_courses_terminated' => $allCoursesTerminated,
            'max_questions_per_course' => $maxQuestionsPerCourse,
        ]);

        return $allCoursesTerminated;
    }

    // public function totalQuestionsLimitReached(Assessment $assessment): bool
    // {
    //     $courses = $assessment->assessment_courses;
    //     $totalQuestions = AssessmentItem::whereIn(
    //         'assessment_course_id', 
    //         $courses->pluck('assessment_course_id')
    //     )->count();
    //     $limitReached = $totalQuestions >= self::MAX_QUESTIONS_TOTAL;

    //     return $limitReached;
    // }

    public function fixedLength(Assessment $assessment): bool {
        $maxQuestions = self::MAX_QUESTIONS;

    }

    public function getTerminationReason(): string
    {
        return "Maximum number of questions " . self::MAX_QUESTIONS . " reached." ;
    }
}