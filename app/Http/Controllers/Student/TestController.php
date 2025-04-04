<?php

namespace App\Http\Controllers\Student;

use App\Enums\AssessmentStatus;
use App\Enums\ItemStatus;
use App\Http\Requests\StudentCourseChoiceRequest;
use App\Http\Requests\TestItemRequest;
use App\Http\Resources\AssessmentItemResource;
use App\Http\Resources\AssessmentReviewResource;
use App\Http\Resources\AssessmentFinishResource;
use App\Http\Resources\CourseResource;

use App\Http\Resources\TestItemResource;
use App\Models\StudentCourseTheta;
use App\Models\ThetaScoreLog;
use App\Services\TerminationRuleService;
use DB;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

use App\Enums\TestType;

use App\Models\Course;
use App\Models\Question;
use App\Models\Student;
use App\Models\Assessment;
use App\Models\AssessmentCourse;
use App\Models\AssessmentItem;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentResource;
use App\Services\ScoringService;
use App\Services\QuestionService;
use App\Services\ThetaService;

class TestController extends Controller
{

    protected $scoringService;
    protected $itemSelectionService;
    protected $thetaService;

    protected $questionService;
    protected $terminationRuleService;

    public function __construct(
        ScoringService $scoringService,
        ThetaService $thetaService,
        QuestionService $questionService,
        TerminationRuleService $terminationRuleService
    ) {
        $this->scoringService = $scoringService;
        $this->thetaService = $thetaService;
        $this->questionService = $questionService;
        $this->terminationRuleService = $terminationRuleService;
    }
    public function index()
    {
        $studentId = Auth::user()->userable->student_id;

        // Get 3 recent test history
        $tests = Assessment::where('student_id', $studentId)
            ->where('status', AssessmentStatus::COMPLETED->value)
            ->orderBy('updated_at', 'desc')
            ->take(3)
            ->get();

        // Log::info('Tests retrieved:', ['count' => $tests->count(), 'tests' => $tests->toArray()]);

        return Inertia::render('Student/Test', [
            'title' => 'Student Test',
            'tests' => AssessmentResource::collection($tests),
        ]);
    }

    public function select()
    {
        // Added to can only select course with greater than 50 questions
        $courses = Course::withCount([
            'questions' => function ($query) {
                $query->where('test_type', 'TEST');
            }
        ])
            ->having('questions_count', '>=', 10)
            ->get();

        if ($courses->isEmpty()) {
            return back()->with('error', 'No courses currently have enough questions for testing.');
        }

        return Inertia::render('Student/Test/SelectCourses', [
            'title' => 'Student Test',
            'courses' => CourseResource::collection($courses),
        ]);
    }

    public function start(StudentCourseChoiceRequest $request)
    {
        $student = Student::find(Auth::user()->userable->student_id);
        $validated = $request->validated();

        if (empty($validated['courses'])) {
            return back()->with('error', 'Please select courses before starting the test.');
        }

        Log::info("===!!! NEW TEST !!!===");

        // Create a new assessment record
        $assessment = Assessment::create([
            'student_id' => $student->student_id,
            'type' => TestType::TEST->value,
            'status' => AssessmentStatus::IN_PROGRESS->value,
            'start_time' => now(),
            'total_items' => 0,
            'total_score' => 0,
            'percentage' => 0,
        ]);

        $assessmentCourses = collect($validated['courses'])->map(function ($course_id) use ($assessment, $student) {
            return [
                'assessment_id' => $assessment->assessment_id,
                'course_id' => $course_id,
                'total_items' => 0,
                'total_score' => 0,
                'initial_theta_score' => StudentCourseTheta::getCurrentTheta($student->student_id, $course_id)->value('theta_score') ?? 0.0,
                'final_theta_score' => 0,
                'percentage' => 0,
                'updated_at' => now(),
            ];
        })->toArray();

        AssessmentCourse::upsert(
            $assessmentCourses,
            ['assessment_id', 'course_id'],
            ['total_items', 'total_score', 'initial_theta_score', 'final_theta_score', 'percentage', 'updated_at']
        );

        session()->forget('assessment_item_count');
        session(['assessment_item_count' => 0]);

        return redirect()->route('test.show', ['assessment' => $assessment->assessment_id]);
    }

    public function show(Assessment $assessment)
    {

        if (!$assessment instanceof Assessment) {
            throw new \InvalidArgumentException('Expected an Assessment model instance.');
        }
        $assessmentItem = $assessment->inProgressItems()
            ->with(['question', 'assessment_course.assessment'])
            ->first();
        if (!$assessmentItem) {
            $assessmentItem = $this->questionService->selectQuestion($assessment);
            // if (!$assessmentItem) {
            //     // No questions available - redirect with error
            //     return redirect()
            //         ->route('dashboard')
            //         ->with('error', 'No more questions available for this assessment');
            // }
            $assessmentItem->load(['assessment_course.assessment']);
        }

        return Inertia::render('Student/Test/Test', [
            'test_item' => new TestItemResource($assessmentItem),
            'item_count' => session('assessment_item_count'),
        ]);
    }

    public function submit(TestItemRequest $request, AssessmentItem $assessment_item)
    {

        $validated = $request->validated();

        $score = $this->scoringService->checkAnswer($assessment_item->question_id, $validated['participants_answer']);
        $assessment_item->update([
            'participants_answer' => json_encode($validated['participants_answer']),
            'score' => $score,
            'status' => ItemStatus::COMPLETED->value
        ]);

        $assessment = Assessment::with([
            'assessment_courses.assessment_items',
            'assessment_courses.theta_score_logs',
            'student'
        ])->where('assessment_id', $validated['assessment_id'])->first();

        $responses = $assessment->assessment_courses->flatMap(function ($course) {
            return $course->assessment_items->map(function ($item) {
                return [
                    'is_correct' => $item->score > 0,
                    'discrimination' => $item->question->discrimination_index ?? 1.0,
                    'difficulty' => $item->question->difficulty_value ?? 0.0,
                ];
            });
        })->toArray();

        $currentCourse = $assessment_item->assessment_course;
        
        $currentCourseTheta = StudentCourseTheta::getCurrentTheta($assessment->student_id, $currentCourse->course_id)->first();
        $previousTheta = $currentCourseTheta->theta_score;

        \Log::info('Fetching StudentCourseTheta:', [
            'student_id' => $assessment->student_id,
            'course_id' => $currentCourse->course_id,
            'previous_theta' => $previousTheta,
        ]);

        $updatedTheta = $this->thetaService->estimateThetaMLE(
            $previousTheta ?? 0.0,
            $responses
        );
        $currentCourseTheta->update(['theta_score' => $updatedTheta, 'updated_at' => now()]);

        ThetaScoreLog::create([
            'assessment_course_id' => $currentCourse->assessment_course_id,
            'assessment_item_id' => $assessment_item->assessment_item_id,
            'previous_theta_score' => $previousTheta,
            'new_theta_score' => $updatedTheta,
        ]);

        \Log::info('Updated StudentCourseTheta:', [
            'student_id' => $assessment->student_id,
            'course_id' => $currentCourse->course_id,
            'new_theta' => $updatedTheta,
        ]);


        session(['assessment_item_count' => session('assessment_item_count', 0) + 1]);

        if ($this->terminationRuleService->shouldTerminateTest($assessment)) {
            $assessment_courses = $assessment->assessment_courses()->get();
            $assessment_courses->each(function ($assessment_course) use ($assessment, $updatedTheta) {

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

            session()->forget('assessment_item_count');
            return redirect()->route('test.finish', ['assessment' => $assessment->assessment_id]);
        }
        return redirect()->route('test.show', $assessment->assessment_id)->with('message', 'success');
    }

    public function finish(Assessment $assessment)
    {
        $assessment->load('assessment_courses.course');

        return Inertia::render('Student/Test/TestFinish', [
            'assessment' => new AssessmentResource($assessment),
            'assessment_courses' => AssessmentFinishResource::collection($assessment->assessment_courses),
            'title' => "Finish",
        ]);
    }
    public function review(Assessment $assessment)
    {
        $assessment->load([
            'assessment_courses.assessment_items.question',
            'assessment_courses.course',
            'assessment_courses.assessment_items'
        ]);

        $student = Student::find(Auth::user()->userable->student_id);

        return Inertia::render('Student/Test/TestReview', [
            'assessment_courses' => AssessmentReviewResource::collection($assessment->assessment_courses),
            'assessment_id' => $assessment->assessment_id,
        ]);
    }

    public function history()
    {
        $studentId = Auth::user()->userable->student_id;
        $query = Assessment::with(['assessment_courses.course'])
            ->where('student_id', $studentId)
            ->where('status', AssessmentStatus::COMPLETED->value);

        if ($courseTitle = request('course')) {
            $query->whereHas('assessment_courses.course', function ($q) use ($courseTitle) {
                $q->where('title', 'like', '%' . $courseTitle . '%');
            });
        }

        // Filter by date range
        if ($fromDate = request('from')) {
            $query->whereDate('created_at', '>=', $fromDate);
        }

        if ($toDate = request('to')) {
            $query->whereDate('created_at', '<=', $toDate);
        }
        if ($testType = request('test_types')) {
            $query->where('type', $testType);
        }

        $sort = request()->query('sort', ''); // Empty by default
        $sortField = $sortDirection = null;
        // Only split if $sort is not empty
        if (!empty($sort)) {
            [$sortField, $sortDirection] = explode(':', $sort);

            // Ensure sortDirection is either 'asc' or 'desc', otherwise set it to null
            if (!in_array($sortDirection, ['asc', 'desc'])) {
                $sortDirection = null;
            }
        }
        if (!empty($sortField) && !empty($sortDirection)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }


        $perPage = request('items', 5);
        $assessments = $query->paginate($perPage)->onEachSide(1);


        $title = DB::table('courses')->distinct()->pluck('title');
        $testTypes = collect(TestType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();


        $filters = [
            'course' => $title,
            'test_types' => $testTypes,
        ];

        return Inertia::render('Student/TestHistory', [
            'title' => 'Student Test',
            'tests' => AssessmentResource::collection($assessments),
            'filters' => $filters,
            'queryParams' => request()->query() ?: null,
        ]);
    }
}





// public function nextQuestion(TestItemRequest $request, )
// {
//     $validated = $request->validate([
//         'assessment_id' => 'required|exists:assessments,assessment_id',
//         'assessment_item_id' => 'required|exists:assessment_items,assessment_item_id',
//         'question_id' => 'required|exists:questions,question_id',
//         'answer' => 'nullable'
//     ]);

//     $validated = $request->validated();

//     $assessment = Assessment::with(['assessment_courses.assessment_items', 'assessment_courses.theta_score_logs', 'student'])
//         ->findOrFail($validated['assessment_id']);

//     $assessmentItem = $assessment->assessment_courses
//         ->flatMap(function ($course) {
//             return $course->assessment_items;
//         })
//         ->firstWhere('assessment_item_id', $validated['assessment_item_id']);

//     $participantsAnswer = is_array($validated['answer']) ? json_encode($validated['answer']) : json_encode([$validated['answer']]);
//     $assessmentItem->participants_answer = $participantsAnswer;

//     $question = Question::with(['course'])->findOrFail($validated['question_id']);

//     // Calculate the score using the scoring service
//     $score = $this->scoringService->checkAnswer($assessmentItem->question_id, $assessmentItem->participants_answer);
//     $assessmentItem->score = $score;
//     $assessmentItem->save();

//     $responses = $assessment->assessment_courses->flatMap(function ($course) {
//         return $course->assessment_items->map(function ($item) {
//             return [
//                 'is_correct' => $item->score > 0,
//                 'discrimination' => $item->question->discrimination_index ?? 1.0,
//                 'difficulty' => $item->question->difficulty_value ?? 0.0,
//             ];
//         });
//     })->toArray();

//     $currentCourse = $assessmentItem->assessment_course;
//     $previousTheta = $this->thetaService->getCurrentTheta($currentCourse->course_id,$assessment->student_id);
//     $updatedTheta = $this->thetaService->estimateThetaMLE(
//         $currentCourse->initial_theta_score ?? 0.0,
//         $responses
//     );
//     $this->thetaService->updateThetaForStudent($assessment->student_id,$currentCourse->course_id, $updatedTheta);

//     Log::info("Updated Theta for Course {$currentCourse->course_id}: ", [
//         'updated_theta' => $updatedTheta
//     ]);

//     // Save to theta_score_logs
//     ThetaScoreLog::create([
//         'assessment_course_id' => $currentCourse->assessment_course_id,
//         'assessment_item_id' => $assessmentItem->assessment_item_id,
//         'previous_theta_score' => $previousTheta,
//         'new_theta_score' => $updatedTheta,
//     ]);


//     // Ensure the correct type is passed
//     if (!$assessment instanceof Assessment) {
//         throw new \InvalidArgumentException('Expected an Assessment model instance.');
//     }

//     //check termination rule
//     if ($this->terminationRuleService->shouldTerminateTest($assessment)) {
//         return redirect()->route('test.finish', ['assessmentId' => $assessment->assessment_id]);
//     }

//     $assessmentItem = $this->questionService->selectQuestion($assessment);


//     return Inertia::render('Student/Test/Test', [
//         'assessment_item' => new AssessmentItemResource($assessmentItem),
//     ]);
// }

// private function updateAssessmentCourses($assessmentId)
// {
//     $totalItems = 0;
//     $assessmentCourses = AssessmentCourse::where('assessment_id', $assessmentId)->get();

//     foreach ($assessmentCourses as $assessmentCourse) {
//         // Calculate total score and items for this assessment course
//         $totalCourseItems = AssessmentItem::where('assessment_course_id', $assessmentCourse->assessment_course_id)
//             ->count();
//         $totalCourseScore = AssessmentItem::where('assessment_course_id', $assessmentCourse->assessment_course_id)
//             ->sum('score');

//         // Calculate final theta score
//         $initialThetaScore = $assessmentCourse->initial_theta_score;
//         $finalThetaScore = $this->calculateFinalThetaScore(
//             $initialThetaScore,
//             $totalCourseScore,
//             $totalCourseItems
//         );

//         // Update assessment course
//         $assessmentCourse->update([
//             'total_items' => $totalCourseItems,
//             'total_score' => $totalCourseScore,
//             'percentage' => $totalCourseItems > 0
//                 ? ($totalCourseScore / $totalCourseItems) * 100
//                 : 0,
//             'final_theta_score' => $finalThetaScore
//         ]);

//         // Accumulate total items
//         $totalItems += $totalCourseItems;
//     }

//     return $totalItems;
// }

// private function calculateTotalScore($assessmentId)
// {
//     return AssessmentItem::whereHas('assessment_course', function ($query) use ($assessmentId) {
//         $query->where('assessment_id', $assessmentId);
//     })->sum('score');
// }

// private function calculatePercentage($assessmentId)
// {
//     $totalItems = AssessmentItem::whereHas('assessment_course', function ($query) use ($assessmentId) {
//         $query->where('assessment_id', $assessmentId);
//     })->count();

//     $totalScore = $this->calculateTotalScore($assessmentId);

//     return $totalItems > 0 ? ($totalScore / $totalItems) * 100 : 0;
// }

// private function updateStudentCourseThetaScores(Assessment $assessment)
// {
//     $assessmentCourses = $assessment->assessment_courses;

//     foreach ($assessmentCourses as $assessmentCourse) {
//         // Create or update StudentCourseTheta for each course
//         StudentCourseTheta::updateOrCreate(
//             [
//                 'student_id' => $assessment->student_id,
//                 'course_id' => $assessmentCourse->course_id,
//             ],
//             [
//                 'theta_score' => $assessmentCourse->final_theta_score,
//                 'created_at' => now(),
//                 'updated_at' => now()
//             ]
//         );
//     }
// }

// Log::info('Assessment Item Updated:', [
//     'assessment_item_id' => $assessmentItem->assessment_item_id,
//     'score' => $assessmentItem->score,
//     'participants_answer' => $assessmentItem->participants_answer,
// ]);

// Log::info('Assessment Item Updated:', [
//     'assessment_item_id' => $assessmentItem->assessment_item_id,
//     'score' => $assessmentItem->score,
//     'participants_answer' => $assessmentItem->participants_answer,
// ]);

// // Prepare responses for theta estimation
// $responses = $assessment->assessment_courses->flatMap(function ($course) {
//     return $course->assessment_items->map(function ($item) {
//         return [
//             'is_correct' => $item->score > 0,
//             'discrimination' => $item->question->discrimination_index ?? 1.0,
//             'difficulty' => $item->question->difficulty_value ?? 0.0,
//         ];
//     });
// })->toArray();

// // Estimate the updated theta using MLE
// $currentCourse = $assessmentItem->assessment_course;
// $updatedTheta = $this->thetaService->estimateThetaMLE(
//     $currentCourse->initial_theta_score ?? 0.0,
//     $responses
// );

// // Log the updated theta
// Log::info("Updated Theta for Course {$currentCourse->course_id}: ", [
//     'updated_theta' => $updatedTheta
// ]);

// // Save to theta_score_logs
// ThetaScoreLog::create([
//     'assessment_course_id' => $currentCourse->assessment_course_id,
//     'assessment_item_id' => $assessmentItem->assessment_item_id,
//     'previous_theta_score' => $currentCourse->theta_score_logs()->latest()->value('new_theta_score') ?? $currentCourse->initial_theta_score ?? 0.0,
//     'new_theta_score' => $updatedTheta,
// ]);

// store answered questions
// $answeredQuestions = session()->get('answered_questions', []);
// $answeredQuestions[] = $question->question_id;
// session()->put('answered_questions', array_unique($answeredQuestions));

// Log::info('Answered questions updated in session', [
//     'answered_questions' => $answeredQuestions
// ]);

//save itemm
// $assessmentItem = new AssessmentItem([
//     'question_id' => $question->question_id,
//     'participants_answer' => is_array($validated['answer'])
//         ? json_encode($validated['answer'])
//         : json_encode([$validated['answer']])
// ]);

// // getting the correct answer from question_detail
// $score = $this->scoringService->checkAnswer($assessmentItem);
// $assessmentItem->score = $score;

// $assessmentCourse = AssessmentCourse::updateOrCreate(
//     [
//         'assessment_id' => $assessment->assessment_id,
//         'course_id' => $question->course_id
//     ],
//     [
//         'status' => 'In Progress',
//         'total_items' => 0,
//         'total_score' => 0,
//         'percentage' => 0
//     ]
// );

// try {
//     // Save the AssessmentItem
//     $assessmentItem->assessment_course_id = $assessmentCourse->assessment_course_id;
//     $assessmentItem->save();

//     Log::info('Assessment Item Created:', [
//         'assessment_item_id' => $assessmentItem->assessment_item_id,
//         'assessment_course_id' => $assessmentItem->assessment_course_id,
//         'question_id' => $assessmentItem->question_id,
//         'participants_answer' => $assessmentItem->participants_answer,
//         'score' => $assessmentItem->score
//     ]);
// } catch (\Exception $e) {
//     Log::error('Failed to create Assessment Item:', [
//         'error' => $e->getMessage(),
//         'trace' => $e->getTraceAsString()
//     ]);
// }

// also update assessment course
// $assessmentCourse->increment('total_items');
// $assessmentCourse->increment('total_score', $score);
// // $assessmentCourse->percentage = ($assessmentCourse->total_score / $assessmentCourse->total_items) * 100;
// $assessmentCourse->save();