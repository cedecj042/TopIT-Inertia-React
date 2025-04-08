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
use App\Models\ThetaScoreLog;
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

        $startDate = now()->subMonths(5)->startOfDay(); // 1 month ago
        $endDate = now()->startOfDay(); // today

        $days = $startDate->diffInDays($endDate) + 1;

        for ($i = 0; $i < $days; $i++) {
            $currentDate = $startDate->copy()->addDays($i);

            $selectedCourses = $usedCourses->splice(0, min(3, $usedCourses->count()));
            if ($usedCourses->isEmpty()) {
                $usedCourses = collect($courses)->shuffle();
            }

            $assessment = Assessment::create([
                'student_id' => $this->student->student_id,
                'type' => 'TEST',
                'status' => AssessmentStatus::IN_PROGRESS->value,
                'start_time' => $currentDate,
                'total_items' => 0,
                'total_score' => 0,
                'percentage' => 0,
                'created_at' => $currentDate,
                'updated_at' => $currentDate,
            ]);

            $assessmentCourses = $selectedCourses->map(function ($course_id) use ($assessment, $thetaService, $currentDate) {
                return [
                    'assessment_id' => $assessment->assessment_id,
                    'course_id' => $course_id,
                    'total_items' => 0,
                    'total_score' => 0,
                    'initial_theta_score' => StudentCourseTheta::getCurrentTheta($this->student->student_id, $course_id)->value('theta_score') ?? 0.0,
                    'final_theta_score' => 0,
                    'percentage' => 0,
                    'created_at' => $currentDate,
                    'updated_at' => $currentDate,
                ];
            })->toArray();

            AssessmentCourse::upsert(
                $assessmentCourses,
                ['assessment_id', 'course_id'],
                ['total_items', 'total_score', 'initial_theta_score', 'final_theta_score', 'percentage', 'updated_at']
            );

            $this->autoAnswerAssessment($assessment, $questionService, $scoringService, $thetaService, $terminationRuleService,$currentDate);
        }
    }


    private function autoAnswerAssessment($assessment, $questionService, $scoringService, $thetaService, $terminationRuleService, $currentDate)
    {
        $num = rand(0, 20);
        $denum = rand(0, 20);

        while (true) {
            $assessment->load('assessment_courses.assessment_items');
            $assessmentItem = $questionService->selectQuestion($assessment);

            if (!$assessmentItem) {
                break;
            }
            $assessmentItem->load(['assessment_course.assessment']);

            $randomAnswer = $this->generateRandomAnswer($assessmentItem->question, $num, $denum);
            $score = $scoringService->checkAnswer($assessmentItem->question_id, $randomAnswer);
            $assessmentItem->update([
                'participants_answer' => is_string($randomAnswer) ? json_encode($randomAnswer) : $randomAnswer,
                'score' => $score,
                'status' => ItemStatus::COMPLETED->value,
                'updated_at'=>$currentDate,
                'created_at'=>$currentDate,
            ]);
            $responses = $assessmentItem->assessment_course->assessment_items->map(function ($item) {
                return [
                    'is_correct' => $item->score > 0,
                    'discrimination' => $item->question->discrimination_index ?? 1.0,
                    'difficulty' => $item->question->difficulty_value ?? 0.0,
                ];
            })->toArray();

            $currentCourse = $assessmentItem->assessment_course;
            $currentCourseTheta = StudentCourseTheta::getCurrentTheta($assessment->student_id, $currentCourse->course_id)->first();
            $previousTheta = $currentCourseTheta->theta_score ?? 0.0;

            $updatedTheta = $thetaService->estimateThetaMAP(
                $responses,
                $previousTheta ?? 0.0,
            );
            $currentCourseTheta->update(['theta_score' => $updatedTheta, 'updated_at' => now()]);
            ThetaScoreLog::create([
                'assessment_course_id' => $currentCourse->assessment_course_id,
                'assessment_item_id' => $assessmentItem->assessment_item_id,
                'previous_theta_score' => $previousTheta,
                'new_theta_score' => $updatedTheta,
                'updated_at'=>$currentDate,
                'created_at'=>$currentDate,
            ]);
            if ($terminationRuleService->shouldTerminateTest($assessment)) {
                $assessment_courses = $assessment->assessment_courses()->get();

                $assessment_courses->each(function ($assessment_course) use ($assessment,$currentDate) {
                    $currentCourseTheta = StudentCourseTheta::getCurrentTheta($assessment->student_id, $assessment_course->course_id)->first();
                    $assessment_course->loadAggregate('assessment_items as courseScore', 'sum(score)');
                    $assessment_course->loadCount('assessment_items as courseItems');

                    $courseScore = $assessment_course->courseScore ?? 0;
                    $courseItems = $assessment_course->courseItems ?? 0;
                    $percentage = ($courseItems > 0) ? ($courseScore / $courseItems) * 100 : 0;

                    $assessment_course->update([
                        'total_items' => $courseItems,
                        'total_score' => $courseScore,
                        'percentage' => $percentage,
                        'final_theta_score' => $currentCourseTheta->theta_score,
                    ]);
                });

                $totalScore = $assessment->assessment_courses()->sum('total_score');
                $totalItems = $assessment->assessment_courses()->sum('total_items');

                $assessment->update([
                    'end_time' => $currentDate,
                    'status' => AssessmentStatus::COMPLETED->value,
                    'total_items' => $totalItems,
                    'total_score' => $totalScore,
                    'percentage' => ($totalItems > 0) ? ($totalScore / $totalItems) * 100 : 0,
                ]);

                return;
            }
        }
    }

    private function generateRandomAnswer($question,$num, $denum)
    {

        $choices = $question->choices ? json_decode($question->choices, true) : [];
        $correctAnswer = $question->answer ? json_decode($question->answer, true) : [];

        $probability = ($denum > 0 && $num > 0) ? ($num / $denum) : 0;
        // Simulate a correct (1) or incorrect (0) response
        $isCorrect = (mt_rand() / mt_getrandmax()) < $probability ? 1 : 0;
        if ($question->question_type === QuestionType::MULTIPLE_CHOICE_SINGLE->value) {
            return  $isCorrect ? (is_array($correctAnswer) ? [collect($correctAnswer)->random()] : [$correctAnswer])
                : [collect($choices)->random()];
        } elseif ($question->question_type === QuestionType::MULTIPLE_CHOICE_MANY->value) {
            return $isCorrect? (is_array($correctAnswer) ? $correctAnswer : [$correctAnswer])
                : collect($choices)->random(rand(1, count($choices)))->toArray();
        } else {
            return $isCorrect ? (is_array($correctAnswer) ? collect($correctAnswer)->random() : $correctAnswer)
                : 'wrong_answer';
        }
    }


}
