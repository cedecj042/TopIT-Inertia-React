<?php

namespace App\Http\Controllers\Student;

use App\Enums\AssessmentStatus;
use App\Enums\ItemStatus;
use App\Enums\QuestionDifficulty;
use App\Enums\TestType;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePretestRequest;
use App\Http\Resources\AssessmentCourseResource;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\AssessmentReviewResource;
use App\Http\Resources\TestCoursesResource;
use App\Models\AssessmentType;
use App\Models\Question;
use App\Models\StudentCourseTheta;
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
            ->testType('Pretest')
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

        if ($student->pretest_status === true) {
            $assessment_id = Assessment::testType('Pretest')->first()->value('assessment_id');
            return redirect()->route('student.test.finish', $assessment_id);
        }

        $existingPretest = $student->assessments()
            ->whereHas('assessment_type', function ($query) {
                $query->where('type', 'Pretest');
            })
            ->where('status', 'In Progress')
            ->with('assessment_courses.course', 'assessment_courses.assessment_items.question')
            ->first();

        if (!$existingPretest) {
            $type = AssessmentType::testType(TestType::PRETEST->value)->first();
            $courses = Course::with('questions')->get();
            $filtered_courses = $courses->filter(fn($course) => $course->questions->isNotEmpty());
            $questionMap = $filtered_courses->mapWithKeys(function ($course) use ($type) {
                // return [$course->course_id => Question::selectForAssessment($course, $type->total_questions)];
                $selected = Question::selectForAssessment($course, $type->total_questions);
                \Log::info("Course {$course->title} selected " . $selected->count() . " questions");
                return [$course->course_id => $selected];
            });

            $totalItems = $questionMap->flatten()->count();

            $assessmentData = [
                'student_id' => $student->student_id,
                'type_id' => $type->type_id,
                'status' => 'In Progress',
                'start_time' => now(),
                'total_score' => 0,
                'percentage' => 0,
                'total_items' => $totalItems,
            ];

            $existingPretest = $student->assessments()->updateOrCreate([
                'student_id' => $student->student_id,
                'type_id' => $type->type_id,
            ], $assessmentData);


            $assessmentCourses = collect($filtered_courses)->map(function ($course) use ($existingPretest, $questionMap) {
                $selectedQuestions = $questionMap[$course->course_id] ?? collect();
                $currentTheta = StudentCourseTheta::getCurrentTheta($existingPretest->student_id, $course->course_id)->first()->theta_score ?? 0.0;
                return [
                    'assessment_id' => $existingPretest->assessment_id,
                    'course_id' => $course->course_id,
                    'total_items' =>  $selectedQuestions->count(),
                    'initial_theta_score' => $currentTheta,
                    'total_score' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            AssessmentCourse::upsert(
                $assessmentCourses,
                ['assessment_id', 'course_id'],
                ['total_items', 'initial_theta_score', 'total_score']
            );

            $assessmentCourseIds = AssessmentCourse::where('assessment_id', $existingPretest->assessment_id)
                ->pluck('assessment_course_id', 'course_id');

            $assessmentItems = $questionMap->flatMap(function ($questions, $courseId) use ($assessmentCourseIds, $student) {
                return $questions->map(function ($question) use ($courseId, $assessmentCourseIds, $student) {
                    return [
                        'assessment_course_id' => $assessmentCourseIds[$courseId] ?? null,
                        'question_id' => $question->question_id,
                        'previous_theta_score' => StudentCourseTheta::getCurrentTheta($student->student_id, $courseId)->value('theta_score'),
                        'status' => ItemStatus::IN_PROGRESS->value,
                        'created_at' => now(),
                    ];
                });
            })
                ->filter(function ($item) {
                    return $item['assessment_course_id'] !== null;
                })
                ->values()
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
        $student_id = $assessment->student_id;
        $assessmentItems = collect($validated['assessment_items'])
            ->values()
            ->map(function ($item) use ($student_id) {
                $score = $this->scoringService->checkAnswer($item['question_id'], $item['participant_answer']);
                $courseId = AssessmentCourse::where('assessment_course_id', $item['assessment_course_id'])->first()->value('course_id');
                return [
                    'assessment_item_id' => $item['assessment_item_id'],
                    'assessment_course_id' => $item['assessment_course_id'],
                    'question_id' => $item['question_id'],
                    'participants_answer' => json_encode($item['participant_answer']),
                    'previous_theta_score' => StudentCourseTheta::getCurrentTheta($student_id, $courseId)->value('theta_score'),
                    'score' => $score,
                    'status' => ItemStatus::COMPLETED->value,
                    'updated_at' => now()
                ];
            })
            ->toArray();

        AssessmentItem::upsert(
            $assessmentItems,
            ['assessment_item_id', 'assessment_course_id', 'question_id'],
            ['participants_answer', 'status', 'score', 'updated_at']
        );

        $assessment_courses = $assessment->assessment_courses()->get();
        $assessment_courses->each(function ($assessment_course) use ($assessment) {

            $responses = $assessment_course->assessment_items()->get()->map(function ($item) {
                return [
                    'is_correct' => $item->score > 0,
                    'discrimination' => $item->question->discrimination_index ?? 1.0,
                    'difficulty' => $item->question->difficulty_value ?? 0.0,
                ];
            })->toArray();

            $updatedTheta = $this->thetaService->estimateThetaMAP(
                $responses,
                $assessmentCourse->initial_theta_score ?? 0.0
            );


            $currentCourseTheta = StudentCourseTheta::getCurrentTheta($assessment->student_id, $assessment_course->course_id)->first();
            $currentCourseTheta->update(['theta_score' => $updatedTheta, 'updated_at' => now()]);

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
        $assessment->student->update(['pretest_completed' => true]);

        return redirect()->route('test.finish', $assessment->assessment_id);
    }
}
