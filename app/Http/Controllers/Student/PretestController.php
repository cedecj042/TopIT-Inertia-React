<?php

namespace App\Http\Controllers\Student;

use App\Enums\AssessmentStatus;
use App\Enums\ItemStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePretestRequest;
use App\Http\Resources\AssessmentCourseResource;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\AssessmentReviewResource;
use App\Http\Resources\TestCoursesResource;
use App\Services\ScoringService;
use App\Services\ThetaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use App\Models\Course;
use App\Models\Student;
use App\Models\Assessment;
use App\Models\AssessmentItem;
use App\Models\AssessmentCourse;
use App\Http\Resources\StudentResource;


class PretestController extends Controller
{
    protected $scoringService;
    protected $thetaService;


    public function __construct(
        ScoringService $scoringService,
        ThetaService $thetaService,
    ) {
        $this->scoringService = $scoringService;
        $this->thetaService = $thetaService;
    }

    public function welcome()
    {
        $student = Student::find(Auth::user()->userable->student_id);

        $existingPretest = Assessment::where('student_id', $student->student_id)
            ->where('type', 'Pretest')
            ->where('status', 'Completed')
            ->first();

        return Inertia::render('Student/Pretest/Welcome', [
            'student' => new StudentResource($student),
            'title' => "Welcome",
            'hasExistingPretest' => !!$existingPretest
        ]);
    }

    public function startPretest()
    {
        $student = Student::find(Auth::user()->userable->student_id);

        if ($student->pretest_status == 'Completed') {
            return redirect()->route('student.pretest.finish', $student->pretest_id);
        }

        $existingPretest = $student->assessments()
            ->where('type', 'Pretest')
            ->where('status', 'In Progress')
            ->with('assessment_courses.course', 'assessment_courses.assessment_items.question')
            ->first();

        if (!$existingPretest) {
            $courses = Course::with([
                'questions' => function ($query) {
                    $query->where('test_type', 'Pretest')->select(['choices', 'type']);
                }
            ])->get();

            $totalItems = $courses->sum(fn($course) => $course->questions->count());

            $assessmentData = [
                'student_id' => $student->student_id,
                'type' => 'Pretest',
                'status' => 'In Progress',
                'start_time' => now(),
                'total_score' => 0,
                'percentage' => 0,
                'total_items' => $totalItems,
            ];

            $existingPretest = $student->assessments()->updateOrCreate([
                'student_id' => $student->student_id,
                'type' => 'Pretest',
            ], $assessmentData);

            $assessmentCourses = collect($courses)->map(fn($course) => [
                'assessment_id' => $existingPretest->assessment_id,
                'course_id' => $course->course_id,
                'total_items' => $course->questions->count(),
                'initial_theta_score' => 0.0,
                'total_score' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray();

            AssessmentCourse::upsert(
                $assessmentCourses,
                ['assessment_id', 'course_id'],
                ['total_items', 'initial_theta_score', 'total_score']
            );

            $assessmentCourseIds = AssessmentCourse::where('assessment_id', $existingPretest->assessment_id)
                ->pluck('assessment_course_id', 'course_id');

            $assessmentItems = collect($courses)->flatMap(
                fn($course) =>
                collect($course->questions)->map(fn($question) => [
                    'assessment_course_id' => $assessmentCourseIds[$course->course_id] ?? null,
                    'question_id' => $question->question_id,
                    'status' => ItemStatus::IN_PROGRESS,
                    'created_at' => now(),
                ])
            )->filter(fn($item) => $item['assessment_course_id'] !== null) // Ensure valid IDs
                ->toArray();

            if (!empty($assessmentItems)) {
                AssessmentItem::insert($assessmentItems);
            }
            $existingPretest->load('assessment_courses.course', 'assessment_courses.assessment_items.question');
        }
        return Inertia::render('Student/Pretest/Pretest', [
            'assessment_id' => $existingPretest->assessment_id,
            // 'assessment_courses' => AssessmentCourseResource::collection($existingPretest->assessment_courses),
            'assessment_courses' => TestCoursesResource::collection($existingPretest->assessment_courses),
            'student' => $student
        ]);
    }

    public function submit(StorePretestRequest $request, Assessment $assessment)
    {
        $validated = $request->validated();

        $assessmentItems = collect($validated['assessment_items'])
            ->map(function ($item) {
                $score = $this->scoringService->checkAnswer($item['question_id'], $item['participant_answer']);
                return [
                    'assessment_item_id' => $item['assessment_item_id'],
                    'assessment_course_id' => $item['assessment_course_id'],
                    'question_id' => $item['question_id'],
                    'participants_answer' => json_encode($item['participant_answer']),
                    'score' => $score,
                    'status'=> ItemStatus::COMPLETED,
                    'updated_at' => now()
                ];
            })
            ->toArray();

        AssessmentItem::upsert(
            $assessmentItems,
            ['assessment_item_id', 'assessment_course_id', 'question_id'],
            ['participants_answer', 'score', 'updated_at']
        );

        $assessment_courses = $assessment->assessment_courses()->get();
        $assessment_courses->each(function ($assessment_course) use($assessment) {
            $responses = $assessment_course->assessment_items()->get()->map(function ($item) {
                return [
                    'is_correct' => $item->score > 0,
                    'discrimination' => $item->question->discrimination_index ?? 1.0,
                    'difficulty' => $item->question->difficulty_value ?? 0.0,
                ];
            })->toArray();

            $updatedTheta = $this->thetaService->estimateThetaMLE(
                $assessmentCourse->initial_theta_score ?? 0.0,
                $responses
            );
            $this->thetaService->updateThetaForStudent(
                $assessment->student_id, 
                $assessment_course->course_id,
                $updatedTheta
            );

            $courseScore = $assessment_course->assessment_items()->sum('score');
            $courseItems = $assessment_course->total_items;
            $percentage = ($courseItems > 0) ? ($courseScore / $courseItems) * 100 : 0;

            $assessment_course->update([
                'total_items' => $courseItems,
                'total_score' => $courseScore,
                'percentage' => $percentage,
                'final_theta_score' => $updatedTheta,
                'updated_at' => now()
            ]);
        });

        $totalScore = $assessment->assessment_courses()->sum('total_score');
        $totalItems = $assessment->assessment_courses()->sum('total_items');

        $assessment->update([
            'end_time' => now(),
            'status' => AssessmentStatus::COMPLETED,
            'total_items' => $totalItems,
            'total_score' => $totalScore,
            'percentage' => ($totalItems > 0) ? ($totalScore / $totalItems) * 100 : 0,
        ]);

        return redirect()->route('test.finish', $assessment->assessment_id);
    }
}
