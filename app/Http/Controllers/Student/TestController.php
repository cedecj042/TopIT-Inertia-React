<?php

namespace App\Http\Controllers\Student;

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

use App\Services\ScoringService;
use App\Services\ItemSelectionService;

class TestController extends Controller
{

    protected $scoringService;
    protected $itemSelectionService;

    public function __construct(ScoringService $scoringService, ItemSelectionService $itemSelectionService)
    {
        $this->scoringService = $scoringService;
        $this->itemSelectionService = $itemSelectionService;
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

        // first, fetch the selected courses
        $selectedCourses = $request->input('courses', []);
        Log::info("selected courses:", $selectedCourses);

        if (empty($selectedCourses)) {
            return redirect()->route('test.course')
                ->with('error', 'Please select courses before starting the test.');
        }

        // store student's selected courses in session
        session()->put("assessment_selected_courses", $selectedCourses);
        Log::info('stored Modules in Session', [
            'selected_courses' => session()->get("assessment_selected_courses")
        ]);

        // create new assessment record once test starts
        $assessment = Assessment::create([
            'student_id' => $student->student_id,
            'type' => 'Test',
            'status' => 'In Progress',
            'start_time' => now(),
            'total_items' => 0,
            'total_score' => 0,
            'percentage' => 0,
        ]);

        // create assessmentCourse records for selected courses
        foreach ($selectedCourses as $courseId) {
            AssessmentCourse::create([
                'assessment_id' => $assessment->assessment_id,
                'course_id' => $courseId,
                'status' => 'In Progress',
                'total_items' => 0,
                'total_score' => 0,
                //initial to be updated
                'initial_theta_score' => 0, // create function to get student score for each course in student_course_theta table
                'final_theta_score' => 0,
                'percentage' => 0
            ]);
        }

        return redirect()->route('test.page', ['assessmentId' => $assessment->assessment_id]);
    }

    // for rendering the questions
    public function show($assessmentId)
    {
        $assessment = Assessment::with(['assessment_courses', 'student'])->findOrFail($assessmentId);
        $selectedCourses = session()->get("assessment_selected_courses");

        Log::info('Retrieved Courses from Session', [
            'selected_courses' => $selectedCourses
        ]);

        $question = $this->selectFirstQuestion($selectedCourses, $assessment->student);

        // Log::info("Selected Question Details", [
        //     'question_course_id' => $question ? $question->course_id : 'No question found',
        //     'selected_course_ids' => $selectedCourses
        // ]);

        Log::info("Initial question details", [
            'question_id' => $question->question_id,
            'course_id' => $question->course_id,
            'difficulty' => $question->difficulty_type
        ]);

        return Inertia::render('Student/Test/Test', [
            'assessment' => $assessment,
            'question' => $question,
        ]);
    }

    protected function selectFirstQuestion(array $courseIds, Student $student)
    {
        try {
            // Get initial theta from student's course history or use default
            $initialTheta = StudentCourseTheta::whereIn('course_id', $courseIds)
                ->where('student_id', $student->student_id)
                ->value('theta_score') ?? 0;

            // Get available questions
            $availableQuestions = Question::whereIn('course_id', $courseIds)
                ->with(['question_detail', 'course'])
                ->get();

            // Format questions for item selection
            $items = $availableQuestions->map(function ($question) {
                return [
                    'id' => $question->question_id,
                    'a' => $question->discrimination_index ?? 1.0,
                    'b' => $question->difficulty_value ?? 0.0,
                    'course' => $question->course_id,
                    'question' => $question
                ];
            })->toArray();

            // Select first course (you might want to implement a specific course selection strategy)
            $firstCourse = $courseIds[0];

            // Get optimal first question
            $selectedItem = $this->itemSelectionService->getMaximumItemByCourse(
                $initialTheta,
                $firstCourse,
                $items
            );

            if (!$selectedItem) {
                return $availableQuestions->random();
            }

            Log::info("First question ", [
                'initial_theta' => $initialTheta,
                'course_id' => $firstCourse,
                'question' => $items
            ]);

            return Question::find($selectedItem['id']);

        } catch (\Exception $e) {
            Log::error('Error in selectFirstQuestion: ' . $e->getMessage());
            // Fallback to random selection
            return Question::whereIn('course_id', $courseIds)
                ->with(['question_detail', 'course'])
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

        // answered questions
        Log::info('Answered questions updated in session', [
            'answered_questions' => $answeredQuestions
        ]);

        $assessmentItem = new AssessmentItem([
            'question_id' => $question->question_id,
            'participants_answer' => is_array($validated['answer'])
                ? json_encode($validated['answer'])
                : json_encode([$validated['answer']])
        ]);

        // getting the correct answer from question_detail
        $score = $this->scoringService->checkAnswer($assessmentItem);
        $assessmentItem->score = $score;

        $assessmentCourse = AssessmentCourse::firstOrCreate(
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
        $assessmentCourse->percentage = ($assessmentCourse->total_score / $assessmentCourse->total_items) * 100;
        //$assessmentCourse->initial_theta_score = // function/service to calculate 
        $assessmentCourse->save();

        //testing
        $nextQuestion = $this->selectNextQuestion($assessment, $question);

        return Inertia::render('Student/Test/Test', [
            'assessment' => $assessment,
            'question' => $nextQuestion,
        ]);

    }

    protected function selectNextQuestion(Assessment $assessment, Question $currentQuestion)
    {
        // for testing only
        // Find a question that:
        // 1. Is in the selected courses
        // 2. Has not been used in this current session assessment
        // 3. Use the item selection algorithm


        $selectedCourses = session()->get("assessment_selected_courses", []);
        $answeredQuestions = session()->get('answered_questions', []);

        //get the assessment course for the current question
        $assessmentCourse = AssessmentCourse::where('assessment_id', $assessment->assessment_id)
            ->where('course_id', $currentQuestion->course_id)
            ->first();

        // get student's current theta for the course
        $currentTheta = $assessmentCourse->final_theta_score ?? 0;

        Log::info('Current course theta score:', [
            'student_id' => $assessment->student_id,
            'course_id' => $assessmentCourse->course_id,
            'theta' => $currentTheta
        ]);

        // get only available/unanswered questions
        $availableQuestions = Question::whereIn('course_id', $selectedCourses)
            ->whereNotIn('question_id', $answeredQuestions)
            ->get();

        if ($availableQuestions->isEmpty()) {
            Log::info('No more available questions', [
                'selected_courses' => $selectedCourses,
                'answered_questions' => $answeredQuestions
            ]);
            return null;
        }

        $items = $availableQuestions->map(function ($question) {
            return [
                'id' => $question->question_id,
                'a' => $question->discrimination_index ?? 1.0, // Default discrimination if not set
                'b' => $question->difficulty_value ?? 0.0,    // Default difficulty if not set
                'course' => $question->course_id,
                'question' => $question
            ];
        })->toArray();

        //retrieve theta 
        //$currentTheta = 0;

        $selectedItem = $this->itemSelectionService->getMaximumItemByCourse(
            $currentTheta,
            $currentQuestion->course_id,
            $items
        );

        $nextQuestion = Question::find($selectedItem['id']);
        Log::info("Next question selected via CAT", [
            'question_id' => $nextQuestion->question_id,
            'course_id' => $nextQuestion->course_id,
            'difficulty' => $nextQuestion->difficulty_value,
            'discrimination' => $nextQuestion->discrimination_value,
            'current_theta' => $currentTheta
        ]);

        return $nextQuestion;
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
