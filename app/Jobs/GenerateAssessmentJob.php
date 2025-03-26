<?php

namespace App\Jobs;

use App\Enums\AssessmentStatus;
use App\Enums\ItemStatus;
use App\Enums\QuestionType;
use App\Models\Assessment;
use App\Models\AssessmentCourse;
use App\Models\Course;
use App\Models\Student;
use App\Models\StudentCourseTheta;
use App\Services\QuestionService;
use App\Services\ScoringService;
use App\Services\TerminationRuleService;
use App\Services\ThetaService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateAssessmentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $student;

    public function __construct(Student $student)
    {
        $this->student = $student;
    }

    public function handle(
        QuestionService $questionService,
        ScoringService $scoringService,
        ThetaService $thetaService,
        TerminationRuleService $terminationRuleService
    ) {
        try {
            $this->generateAssessments($questionService, $scoringService, $thetaService, $terminationRuleService);
        } catch (\Exception $e) {
            \Log::error("Assessment generation failed for Student ID: {$this->student->student_id}. Error: " . $e->getMessage());
        }
    }

    private function generateAssessments($questionService, $scoringService, $thetaService, $terminationRuleService)
    {
        $courses = Course::pluck('course_id')->toArray();
        $usedCourses = collect($courses)->shuffle();

        for ($i = 0; $i < 50; $i++) {
            $selectedCourses = $usedCourses->splice(0, min(3, $usedCourses->count()));
            if ($usedCourses->isEmpty()) {
                $usedCourses = collect($courses)->shuffle();
            }

            $assessment = Assessment::create([
                'student_id' => $this->student->student_id,
                'type' => 'TEST',
                'status' => AssessmentStatus::IN_PROGRESS->value,
                'start_time' => now(),
                'total_items' => 0,
                'total_score' => 0,
                'percentage' => 0,
            ]);

            $assessmentCourses = $selectedCourses->map(function ($course_id) use ($assessment) {
                return [
                    'assessment_id' => $assessment->assessment_id,
                    'course_id' => $course_id,
                    'total_items' => 0,
                    'total_score' => 0,
                    'initial_theta_score' => StudentCourseTheta::getCurrentTheta($this->student->student_id, $course_id)->value('theta_score') ?? 0.0,
                    'final_theta_score' => 0,
                    'percentage' => 0,
                    'updated_at' => now(),
                ];
            })->toArray();

            AssessmentCourse::upsert($assessmentCourses, ['assessment_id', 'course_id'], ['total_items', 'total_score', 'initial_theta_score', 'final_theta_score', 'percentage', 'updated_at']);

            $this->autoAnswerAssessment($assessment, $questionService, $scoringService, $thetaService, $terminationRuleService);
        }
    }

    private function autoAnswerAssessment($assessment, $questionService, $scoringService, $thetaService, $terminationRuleService)
    {
        while (true) {
            $assessment->load('assessment_courses.assessment_items');
            $assessmentItem = $questionService->selectQuestion($assessment);
            \Log::info("Selected Assessment Item: " . json_encode($assessmentItem));

            if (!$assessmentItem) {
                \Log::info("No more questions available, terminating assessment.");
                break;
            }
            $assessmentItem->load(['assessment_course.assessment']);

            $randomAnswer = $this->generateRandomAnswer($assessmentItem->question);
            $score = $scoringService->checkAnswer($assessmentItem->question_id, $randomAnswer);
            \Log::info('Answer = ' . json_encode($randomAnswer) . "| Score: " . $score);
            $assessmentItem->update([
                'participants_answer' => is_string($randomAnswer) ? json_encode($randomAnswer) : $randomAnswer,
                'score' => $score,
                'status' => ItemStatus::COMPLETED->value
            ]);
            \Log::info("Assessment Courses: " . json_encode($assessment->assessment_courses));
            $responses = $assessment->assessment_courses->flatMap(function ($course) {
                return $course->assessment_items->map(function ($item) {
                    return [
                        'is_correct' => $item->score > 0,
                        'discrimination' => $item->question->discrimination_index ?? 1.0,
                        'difficulty' => $item->question->difficulty_value ?? 0.0,
                    ];
                });
            })->toArray();
            \Log::info("Generated Responses for Theta Calculation: " . json_encode($responses));

            $currentCourse = $assessmentItem->assessment_course;
            $currentCourseTheta = StudentCourseTheta::getCurrentTheta($assessment->student_id, $currentCourse->course_id)->first();
            $previousTheta = $currentCourseTheta->theta_score ?? 0.0;
            $updatedTheta = $thetaService->estimateThetaMLE($previousTheta, $responses);
            \Log::info("Theta Update - Course ID: {$currentCourse->course_id}, Previous Theta: {$previousTheta}, Updated Theta: {$updatedTheta} , CurrentThetaCourse " . json_encode($currentCourseTheta));
            $currentCourseTheta->update(['theta_score' => $updatedTheta, 'updated_at' => now()]);
            if ($terminationRuleService->shouldTerminateTest($assessment)) {
                $assessment_courses = $assessment->assessment_courses()->get();

                $assessment_courses->each(function ($assessment_course) use ($updatedTheta) {
                    $assessment_course->loadAggregate('assessment_items as courseScore', 'sum(score)');
                    $assessment_course->loadCount('assessment_items as courseItems');

                    $courseScore = $assessment_course->courseScore ?? 0;
                    $courseItems = $assessment_course->courseItems ?? 0;
                    $percentage = ($courseItems > 0) ? ($courseScore / $courseItems) * 100 : 0;

                    $assessment_course->update([
                        'total_items' => $courseItems,
                        'total_score' => $courseScore,
                        'percentage' => $percentage,
                        'final_theta_score' => $updatedTheta,
                        'updated_at' => now()
                    ]);
                });

                // Calculate total score and total items for the assessment
                $totalScore = $assessment->assessment_courses()->sum('total_score');
                $totalItems = $assessment->assessment_courses()->sum('total_items');

                $assessment->update([
                    'end_time' => now(),
                    'status' => AssessmentStatus::COMPLETED->value,
                    'total_items' => $totalItems,
                    'total_score' => $totalScore,
                    'percentage' => ($totalItems > 0) ? ($totalScore / $totalItems) * 100 : 0,
                    'updated_at' => now()
                ]);

                return;
            }
        }
    }

    private function generateRandomAnswer($question)
    {
        $choices = $question->choices ? json_decode($question->choices, true) : [];
        $correctAnswer = $question->answer ? json_decode($question->answer, true) : [];

        if ($question->question_type === QuestionType::MULTIPLE_CHOICE_SINGLE->value) {
            return rand(0, 1) ? (is_array($correctAnswer) ? [collect($correctAnswer)->random()] : [$correctAnswer])
                : [collect($choices)->random()];
        } elseif ($question->question_type === QuestionType::MULTIPLE_CHOICE_MANY->value) {
            return rand(0, 1) ? (is_array($correctAnswer) ? $correctAnswer : [$correctAnswer])
                : collect($choices)->random(rand(1, count($choices)))->toArray();
        } else {
            return rand(0, 1) ? (is_array($correctAnswer) ? collect($correctAnswer)->random() : $correctAnswer)
                : 'wrong_answer';
        }
    }


}
