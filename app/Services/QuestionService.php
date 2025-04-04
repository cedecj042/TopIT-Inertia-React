<?php

namespace App\Services;

use App\Enums\ItemStatus;
use App\Models\Assessment;
use App\Models\AssessmentItem;
use App\Models\Question;
use App\Models\StudentCourseTheta;
use Illuminate\Support\Facades\Auth;
use Log;

class QuestionService
{
    protected $itemSelectionService;
    protected $terminationRuleService;
    protected $thetaService;

    public function __construct(ItemSelectionService $itemSelectionService, TerminationRuleService $terminationRuleService, ThetaService $thetaService)
    {
        $this->itemSelectionService = $itemSelectionService;
        $this->terminationRuleService = $terminationRuleService;
        $this->thetaService = $thetaService;
    }

    public function selectQuestion(Assessment $assessment)
    {
        try {
            // Step 1: Retrieve all selected courses
            $courses = $assessment->assessment_courses;

            if ($courses->isEmpty()) {
                Log::info("No courses selected for this assessment.");
                return null;
            }

            // Step 2: Compute MMM probabilities for course selection
            $courseProbabilities = $this->calculateMMMProbabilities($courses);

            // Log::info("Final Normalized Course Probabilities:", $courseProbabilities);

            // Step 3: Select a course based on MMM
            $selectedCourse = $this->weightedRandomSelect($courses, $courseProbabilities);
            // Log::info("Selected Course for the next question:", [
            //     'course_id' => $selectedCourse->course_id,
            //     'title' => $selectedCourse->title,
            //     'probability' => round($courseProbabilities[$selectedCourse->course_id] ?? 0, 4)
            // ]);

            // Step 4: Get the latest theta score of the course
            $currentTheta = StudentCourseTheta::getCurrentTheta($assessment->student_id, $selectedCourse->course_id)->value('theta_score') ?? 0.0;

            // Step 5: Retrieve available questions (excluding already answered)
            $availableQuestions = $this->getAvailableQuestions($selectedCourse);
            if ($availableQuestions->isEmpty()) {
                Log::info("No available questions for course {$selectedCourse->course_id}.");
                return null;
            }

            // Step 6: Apply MFI to select the most informative question
            $items = $this->formatQuestionsForMFI($availableQuestions);

            $selectedItem = $this->itemSelectionService->getMaximumItemByCourse(
                $currentTheta,
                $selectedCourse->course_id,
                $items
            );

            // Step 7: Create assessment item for the selected item
            $assessmentItem = $this->createAssessmentItem($selectedCourse, $selectedItem);
            
            // Eager load relationships
            $assessmentItem->load(['question']);

            // Log::info("New question selected for assessment:", [
            //     'assessment_item_id' => $assessmentItem->assessment_item_id,
            //     'question_id' => $assessmentItem->question_id,
            //     'course_id' => $selectedCourse->course_id,
            //     'theta' => $currentTheta,
            // ]);
            // Step 8: SEM calculation for the course
            $this->calculateCourseSEM($selectedCourse, $currentTheta);

            return $assessmentItem;

        } catch (\Exception $e) {
            Log::error('Error in selectQuestion:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return null;
        }
    }

    private function calculateMMMProbabilities($courses)
    {
        $totalQuestionsAnswered = $courses->sum(fn($course) => $course->assessment_items->count());
        $courseProbabilities = [];

        foreach ($courses as $course) {
            $expectedProportion = 1 / $courses->count();

            $actualProportion = $totalQuestionsAnswered > 0
                ? $course->assessment_items->count() / $totalQuestionsAnswered
                : 0;

            // Adjust probabilities
            $probabilityAdjustment = max(0, $expectedProportion - $actualProportion);
            $courseProbabilities[$course->course_id] = $probabilityAdjustment;

            // Log::info("MMM Calculation for Course {$course->course_id}:", [
            //     'totalquestionsanswered' => $totalQuestionsAnswered,
            //     'expected_proportion' => round($expectedProportion, 4),
            //     'actual_proportion' => round($actualProportion, 4),
            //     'probability_adjustment' => round($probabilityAdjustment, 4)
            // ]);
        }

        // Normalize probabilities
        $probabilitySum = array_sum($courseProbabilities);
        foreach ($courseProbabilities as $courseId => $probability) {
            $courseProbabilities[$courseId] = $probabilitySum > 0 ? $probability / $probabilitySum : 1 / count($courses);
        }

        return $courseProbabilities;
    }

    private function weightedRandomSelect($courses, $weights)
    {
        $rand = mt_rand() / mt_getrandmax(); // Get a random float between 0 and 1
        $cumulative = 0.0;

        foreach ($courses as $course) {
            $cumulative += $weights[$course->course_id] ?? 0;
            if ($rand <= $cumulative) {
                return $course;
            }
        }

        return $courses->first();
    }


    private function getAvailableQuestions($selectedCourse)
    {
        $answeredQuestions = $selectedCourse->assessment_items->pluck('question_id')->toArray();
        return Question::where('course_id', $selectedCourse->course_id)
            ->whereNotIn('question_id', $answeredQuestions)
            ->where('test_type', 'Test')
            ->with(['course'])
            ->get();
    }

    private function formatQuestionsForMFI($availableQuestions)
    {
        return $availableQuestions->map(fn($question) => [
            'id' => $question->question_id,
            'a' => $question->discrimination_index ?? 1.0,
            'b' => $question->difficulty_value ?? 0.0,
            'course' => $question->course_id,
            'type' => $question->type,
            'question' => $question,
        ])->toArray();
    }

    private function calculateCourseSEM($selectedCourse, $currentTheta)
    {
        $allCourseQuestions = Question::where('course_id', $selectedCourse->course_id)
            ->with(['course'])
            ->get();

        $allCourseItems = $allCourseQuestions->map(fn($question) => [
            'id' => $question->question_id,
            'a' => $question->discrimination_index ?? 1.0,
            'b' => $question->difficulty_value ?? 0.0,
            'course' => $question->course_id,
            'type' => $question->type,
            'question' => $question,
        ])->toArray();

        $sem = $this->itemSelectionService->calculateStandardError($currentTheta, $allCourseItems);

        Log::debug('SEM Calculation:', [
            'course_id' => $selectedCourse->course_id,
            'sem' => $sem,
        ]);
    }

    private function createAssessmentItem($selectedCourse, $selectedItem)
    {
        $assessmentItem = AssessmentItem::create([
            'assessment_course_id' => $selectedCourse->assessment_course_id,
            'question_id' => $selectedItem['id'],
            'participants_answer' => null,
            'status' => ItemStatus::IN_PROGRESS,
            'score' => 0,
        ]);

        $assessmentItem->load([
            'question',
            'assessment_course.assessment',
        ]);

        return $assessmentItem;
    }
}
