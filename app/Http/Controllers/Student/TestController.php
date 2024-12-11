<?php

namespace App\Http\Controllers\Student;

use App\Services\TerminationRuleService;
use DB;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

use App\Enums\TestType;

use App\Models\Test;
use App\Models\Course;
use App\Models\Question;
use App\Models\Student;
use App\Models\QuestionDetail;
use App\Models\StudentCourseTheta;
use App\Models\Assessment;
use App\Models\AssessmentCourse;
use App\Models\AssessmentItem;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestResource;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\CourseResource;
use App\Http\Resources\QuestionReviewResource;
use App\Http\Resources\QuestionDetailResource;
use App\Services\ScoringService;
use App\Services\ItemSelectionService;

class TestController extends Controller
{

    protected $scoringService;
    protected $itemSelectionService;
    protected $terminationRuleService;

    public function __construct(ScoringService $scoringService, ItemSelectionService $itemSelectionService, TerminationRuleService $terminationRuleService)
    {
        $this->scoringService = $scoringService;
        $this->itemSelectionService = $itemSelectionService;
        $this->terminationRuleService = $terminationRuleService;
    }

    public function select()
    {
        $courses = Course::all();

        return Inertia::render('Student/Test/SelectCourses', [
            'title' => 'Student Test',
            'courses' => $courses,
        ]);
    }


    public function start(Request $request)
    {
        $student = Student::find(Auth::user()->userable->student_id);

        // Fetch the selected course
        $selectedCourse = $request->input('courses');

        // Store the student's selected course in session
        session()->put("assessment_selected_course", $selectedCourse);
        // Log::info('Stored Course in Session', [
        //     'selected_course' => session()->get("assessment_selected_course")
        // ]);

        // Get the latest theta score for this student and course
        $initialThetaScore = $this->getLatestThetaScore($student->student_id, $selectedCourse);
        Log::info("Initial theta score:", ['initial_theta_score' => $initialThetaScore]);


        // Create a new assessment record
        $assessment = Assessment::create([
            'student_id' => $student->student_id,
            'type' => 'Test',
            'status' => 'In Progress',
            'start_time' => now(),
            'total_items' => 0,
            'total_score' => 0,
            'percentage' => 0,
        ]);

        // Create an assessment course record for the selected course
        AssessmentCourse::create([
            'assessment_id' => $assessment->assessment_id,
            'course_id' => $selectedCourse,
            'status' => 'In Progress',
            'total_items' => 0,
            'total_score' => 0,
            'initial_theta_score' => $initialThetaScore,
            'final_theta_score' => 0,
            'percentage' => 0
        ]);

        return redirect()->route('test.page', ['assessmentId' => $assessment->assessment_id]);
    }

    //this is for placing the initial_theta_score in the assessment course
    protected function getLatestThetaScore(int $studentId, int $courseId)
    {
        $latestTheta = StudentCourseTheta::where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->orderBy('created_at', 'desc')
            ->first();

        // If found, return the theta score
        if ($latestTheta) {
            return $latestTheta->theta_score;
        }

        // If no previous theta score is found, return a default value
        return 0.0;
    }


    // for rendering the questions
    public function show($assessmentId)
    {
        $assessment = Assessment::with(['assessment_courses', 'student'])->findOrFail($assessmentId);
        $selectedCourse = session()->get('assessment_selected_course');

        $answeredQuestions = session()->get('answered_questions', []);
        $question = $this->selectQuestion($assessment, $selectedCourse, $answeredQuestions);

        Log::info("Answered questions:", $answeredQuestions);


        // Log::info("Initial question details", [
        //     'question_id' => $question->question_id,
        //     'course_id' => $question->course_id,
        //     'difficulty' => $question->difficulty_type
        // ]);

        return Inertia::render('Student/Test/Test', [
            'assessment' => $assessment,
            'question' => $question,
        ]);
    }

    protected function selectQuestion(Assessment $assessment, string $courseId, array $answeredQuestions = [])
    {
        try {
            // Determine if it is the first question or subsequent question
            $isFirstQuestion = empty($answeredQuestions);

            // Get the current theta score for the selected course
            $assessmentCourse = AssessmentCourse::where('assessment_id', $assessment->assessment_id)
                ->where('course_id', $courseId)
                ->first();

            $currentTheta = $isFirstQuestion
                ? (StudentCourseTheta::where('course_id', $courseId)
                    ->where('student_id', $assessment->student_id)
                    ->value('theta_score') ?? 0)
                : ($assessmentCourse->initial_theta_score ?? 0);

            // Retrieve available questions for the course
            $availableQuestions = Question::where('course_id', $courseId)
                ->with(['question_detail', 'course'])
                ->whereNotIn('question_id', $answeredQuestions)
                ->get();

            if ($availableQuestions->isEmpty()) {
                Log::info('No more available questions', [
                    'course_id' => $courseId,
                    'answered_questions' => $answeredQuestions
                ]);
                return null;
            }

            // Format questions for item selection
            $items = $availableQuestions->map(function ($question) {
                // Log::debug('Question Detail for Question', [
                //     'question_id' => $question->question_id,
                //     'question_detail_id' => $question->question_detail_id,
                //     'question_detail_loaded' => $question->relationLoaded('question_detail'),
                //     'question_detail' => $question->question_detail ? $question->question_detail->toArray() : null
                // ]);

                return [
                    'id' => $question->question_id,
                    'a' => $question->discrimination_index ?? 1.0,
                    'b' => $question->difficulty_value ?? 0.0,
                    'course' => $question->course_id,
                    'type' => $question->question_detail->type,
                    'question' => $question
                ];
            })->toArray();

            Log::debug('Available Items for Course Selection', [
                'items' => $items
            ]);

            // Select the optimal question using the CAT algorithm
            $selectedItem = $this->itemSelectionService->getMaximumItemByCourse(
                $currentTheta,
                $courseId,
                $items
            );

            Log::info("Selected question", [
                'question_id' => $selectedItem['id'],
                'course_id' => $courseId,
                'difficulty' => $selectedItem['b'],
                'discrimination' => $selectedItem['a'],
                'theta' => $currentTheta
            ]);

            return Question::with('question_detail')->find($selectedItem['id']);
        } catch (\Exception $e) {
            Log::error('Error in selectQuestion: ' . $e->getMessage());
            // Fallback to random selection
            return Question::where('course_id', $courseId)
                ->with(['question_detail', 'course'])
                ->whereNotIn('question_id', $answeredQuestions)
                ->inRandomOrder()
                ->first();
        }
    }


    public function nextQuestion(Request $request)
    {
        $validated = $request->validate([
            'assessment_id' => 'required|exists:assessments,assessment_id',
            'question_id' => 'required|exists:questions,question_id',
            'answer' => 'nullable'
        ]);

        $assessment = Assessment::findOrFail($validated['assessment_id']);
        $question = Question::with(['question_detail', 'course'])->findOrFail($validated['question_id']);

        // store answered questions
        $answeredQuestions = session()->get('answered_questions', []);
        $answeredQuestions[] = $question->question_id;
        session()->put('answered_questions', array_unique($answeredQuestions));

        Log::info('Answered questions updated in session', [
            'answered_questions' => $answeredQuestions
        ]);

        //save itemm
        $assessmentItem = new AssessmentItem([
            'question_id' => $question->question_id,
            'participants_answer' => is_array($validated['answer'])
                ? json_encode($validated['answer'])
                : json_encode([$validated['answer']])
        ]);

        // getting the correct answer from question_detail
        $score = $this->scoringService->checkAnswer($assessmentItem);
        $assessmentItem->score = $score;

        $assessmentCourse = AssessmentCourse::updateOrCreate(
            [
                'assessment_id' => $assessment->assessment_id,
                'course_id' => $question->course_id
            ],
            [
                'status' => 'In Progress',
                'total_items' => 0,
                'total_score' => 0,
                'percentage' => 0
            ]
        );

        try {
            // Save the AssessmentItem
            $assessmentItem->assessment_course_id = $assessmentCourse->assessment_course_id;
            $assessmentItem->save();

            Log::info('Assessment Item Created:', [
                'assessment_item_id' => $assessmentItem->assessment_item_id,
                'assessment_course_id' => $assessmentItem->assessment_course_id,
                'question_id' => $assessmentItem->question_id,
                'participants_answer' => $assessmentItem->participants_answer,
                'score' => $assessmentItem->score
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create Assessment Item:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        // also update assessment course
        $assessmentCourse->increment('total_items');
        $assessmentCourse->increment('total_score', $score);
        // $assessmentCourse->percentage = ($assessmentCourse->total_score / $assessmentCourse->total_items) * 100;
        $assessmentCourse->save();

        //check termination rule
        if ($this->terminationRuleService->shouldTerminateTest($assessment)) {
            return redirect()->route('test.finish', ['assessmentId' => $assessment->assessment_id]);
        }

        // Fetch next question
        $selectedCourse = session()->get('assessment_selected_course');
        $nextQuestion = $this->selectQuestion($assessment, $selectedCourse, $answeredQuestions);


        return Inertia::render('Student/Test/Test', [
            'assessment' => $assessment,
            'question' => $nextQuestion->load('question_detail'),
        ]);
    }

    public function finish($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        session()->forget('answered_questions');
        session()->forget('assessment_selected_course');

        // Update assessment table and assessment course table
        DB::transaction(function () use ($assessment) {
            // Update assessment details
            $totalItems = $this->updateAssessmentCourses($assessment->assessment_id);

            $assessment->update([
                'end_time' => now(),
                'status' => 'Completed',
                'total_items' => $totalItems,
                'total_score' => $this->calculateTotalScore($assessment->assessment_id),
                'percentage' => $this->calculatePercentage($assessment->assessment_id),
            ]);

            // Update student course theta scores table as well
            $this->updateStudentCourseThetaScores($assessment);
        });

        return Inertia::render('Student/Test/TestFinish', [
            'score' => $assessment->total_score,
            'totalQuestions' => $assessment->total_items,
            'assessmentId' => $assessment->assessment_id,
            'title' => "Finish",
        ]);
    }

    private function updateAssessmentCourses($assessmentId)
    {
        $totalItems = 0;
        $assessmentCourses = AssessmentCourse::where('assessment_id', $assessmentId)->get();

        foreach ($assessmentCourses as $assessmentCourse) {
            // Calculate total score and items for this assessment course
            $totalCourseItems = AssessmentItem::where('assessment_course_id', $assessmentCourse->assessment_course_id)
                ->count();
            $totalCourseScore = AssessmentItem::where('assessment_course_id', $assessmentCourse->assessment_course_id)
                ->sum('score');

            // Calculate final theta score
            $initialThetaScore = $assessmentCourse->initial_theta_score;
            $finalThetaScore = $this->calculateFinalThetaScore(
                $initialThetaScore,
                $totalCourseScore,
                $totalCourseItems
            );

            // Update assessment course
            $assessmentCourse->update([
                'total_items' => $totalCourseItems,
                'total_score' => $totalCourseScore,
                'percentage' => $totalCourseItems > 0
                    ? ($totalCourseScore / $totalCourseItems) * 100
                    : 0,
                'final_theta_score' => $finalThetaScore
            ]);

            // Accumulate total items
            $totalItems += $totalCourseItems;
        }

        return $totalItems;
    }

    private function calculateFinalThetaScore($initialTheta, $totalScore, $totalItems)
    {
        //calculate here
        // Simple linear interpolation - you might want to replace with a more sophisticated CAT scoring method
        $scorePercentage = $totalItems > 0 ? ($totalScore / $totalItems) : 0;
        return $initialTheta + ($scorePercentage - 0.5);
    }

    private function calculateTotalScore($assessmentId)
    {
        return AssessmentItem::whereHas('assessment_course', function ($query) use ($assessmentId) {
            $query->where('assessment_id', $assessmentId);
        })->sum('score');
    }

    private function calculatePercentage($assessmentId)
    {
        $totalItems = AssessmentItem::whereHas('assessment_course', function ($query) use ($assessmentId) {
            $query->where('assessment_id', $assessmentId);
        })->count();

        $totalScore = $this->calculateTotalScore($assessmentId);

        return $totalItems > 0 ? ($totalScore / $totalItems) * 100 : 0;
    }

    private function updateStudentCourseThetaScores(Assessment $assessment)
    {
        $assessmentCourses = $assessment->assessment_courses;

        foreach ($assessmentCourses as $assessmentCourse) {
            // Create or update StudentCourseTheta for each course
            StudentCourseTheta::updateOrCreate(
                [
                    'student_id' => $assessment->student_id,
                    'course_id' => $assessmentCourse->course_id,
                ],
                [
                    'theta_score' => $assessmentCourse->final_theta_score,
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );
        }
    }

    public function review($assessmentId)
    {
        $assessment = Assessment::with([
            'assessment_courses.assessment_items.question.question_detail',
            'assessment_courses.course',
            'assessment_courses.assessment_items'
        ])->findOrFail($assessmentId);

        $student = Student::find(Auth::user()->userable->student_id);

        // Organize student answers by question ID for easy lookup
        $studentAnswers = collect();
        foreach ($assessment->assessment_courses as $assessmentCourse) {
            foreach ($assessmentCourse->assessment_items as $item) {
                $studentAnswers->put($item->question_id, [
                    'participants_answer' => $item->participants_answer ?? null,
                    'score' => $item->score,
                    'course_id' => $assessmentCourse->course_id,
                    'question' => $item->question
                ]);
            }
        }

        // Prepare courses with their respective questions that appeared in the test
        $coursesWithAnswers = $studentAnswers->groupBy('course_id')->map(function ($courseQuestions, $courseId) {
            $course = Course::find($courseId);
            $course->questions = $courseQuestions->map(function ($answerData) {
                $question = $answerData['question'];

                // Decode student's answer
                $decodedAnswer = $answerData['participants_answer']
                    ? json_decode($answerData['participants_answer'], true)
                    : null;

                // Prepare student answer details
                $question->student_answer = is_array($decodedAnswer)
                    ? (count($decodedAnswer) > 1 ? $decodedAnswer : $decodedAnswer[0] ?? null)
                    : null;
                $question->is_multiple_answer = is_array($decodedAnswer) && count($decodedAnswer) > 1;
                $question->is_correct = $answerData['score'] > 0;

                // Get the correct answers from question detail
                $question->correct_answers = $question->question_detail->correct_answer
                    ? json_decode($question->question_detail->correct_answer, true)
                    : null;

                return $question;
            });

            return $course;
        });

        $coursesData = CourseResource::collection($coursesWithAnswers)->additional([
            'questions' => $coursesWithAnswers->map(function ($course) {
                return [
                    'course_id' => $course->course_id,
                    'questions' => QuestionReviewResource::collection($course->questions)
                ];
            }),
        ]);

        Log::info('Courses Data Structure:', [
            'data' => json_decode(json_encode($coursesData), true),
        ]);

        return Inertia::render('Student/Test/TestReview', [
            'courses' => $coursesData,
            'assessment' => [
                'assessment_id' => $assessment->assessment_id,
                'status' => $assessment->status,
                'total_score' => $assessment->total_score,
                'total_items' => $assessment->total_items,
                'percentage' => round($assessment->percentage, 2)
            ],
            'student' => $student,
        ]);
    }

    // for display
    public function index()
    {
        $studentId = Auth::user()->userable->student_id;

        // Get 3 recent test history
        $tests = Assessment::where('student_id', $studentId)
            ->orderBy('updated_at', 'desc')
            ->take(3)
            ->get();

        // Log::info('Tests retrieved:', ['count' => $tests->count(), 'tests' => $tests->toArray()]);

        return Inertia::render('Student/Test', [
            'title' => 'Student Test',
            'tests' => AssessmentResource::collection($tests),
        ]);
    }

    public function history(Request $request)
    {
        $studentId = Auth::user()->userable->student_id;

        $tests = Assessment::where('student_id', $studentId)
            ->orderBy('created_at', 'desc')
            ->paginate(4);

        $testsArray = $tests->toArray();

        $title = DB::table('courses')->distinct()->pluck('title');
        $testTypes = collect(TestType::cases())->map(function ($case) {
            return $case->value;
        })->toArray();

        $filters = [
            'course' => $title,
            'test_type' => $testTypes,
        ];

        return Inertia::render('Student/TestHistory', [
            'title' => 'Student Test',
            'tests' => AssessmentResource::collection($tests),
            'paginationLinks' => $testsArray['links'],
            'queryParams' => request()->query() ?: null,
        ]);
    }


}
