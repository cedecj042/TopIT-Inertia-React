<?php

namespace App\Http\Controllers\Student;

use App\Http\Resources\AssessmentResource;
use App\Models\Test;
use App\Models\Course;
use App\Models\Question;
use App\Models\Student;
use App\Models\QuestionDetail;
use App\Models\StudentCourseTheta;
use App\Http\Controllers\Controller;
use App\Http\Resources\TestResource;
use App\Models\Assessment;
use App\Models\AssessmentCourse;
use App\Models\AssessmentItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TestController extends Controller
{
    public function selectModules()
    {
        $courses = Course::all();

        return Inertia::render('Student/Test/SelectModules', [
            'title' => 'Student Test',
            'courses' => $courses,
        ]);
    }


    public function startTest(Request $request)
    {
        $student = Student::find(Auth::user()->userable->student_id);

        // first, fetch the selected modules
        $selectedModules = $request->input('modules', []);
        Log::info("selected modules:", $selectedModules);

        if (empty($selectedModules)) {
            return redirect()->route('modules.select')
                ->with('error', 'Please select modules before starting the test.');
        }

        // store student's selected modules in session
        session()->put("assessment_selected_modules", $selectedModules);
        Log::info('stored Modules in Session', [
            'selected_modules' => session()->get("assessment_selected_modules")
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
        foreach ($selectedModules as $courseId) {
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
    public function showTestPage($assessmentId)
    {
        $assessment = Assessment::with(['assessment_courses', 'student'])->findOrFail($assessmentId);
        $selectedModules = session()->get("assessment_selected_modules");

        Log::info('Retrieved Modules from Session', [
            'selected_modules' => $selectedModules
        ]);

        $question = $this->selectInitialQuestion($selectedModules, $assessment->student);

        // Log::info("Selected Question Details", [
        //     'question_course_id' => $question ? $question->course_id : 'No question found',
        //     'selected_module_ids' => $selectedModules
        // ]);

        Log::info("Initial question details", [
            'question_id' => $question->question_id,
            'course_id' => $question->course_id,
            'difficulty' => $question->difficulty->numeric
        ]);

        return Inertia::render('Student/Test/Test', [
            'assessment' => $assessment,
            'question' => $question,
        ]);
    }

    protected function selectInitialQuestion(array $courseIds, Student $student)
    {
        // initially random, replace with logic
        $question = Question::whereIn('course_id', $courseIds)
            ->whereHas('difficulty', function ($query) {
                $query->where('name', 'average');
            })
            ->with(['question_detail', 'course'])
            ->inRandomOrder()
            ->first();

        return $question;
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

        // getting the correct answer from question_detail
        $correctAnswer = $question->question_detail->answer;

        $score = $this->calculateQuestionScore(
            $question->question_detail->type,
            $validated['answer'],
            $correctAnswer
        );

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

        // create assessment item every question

        try {
            $assessmentItem = AssessmentItem::create([
                'assessment_course_id' => $assessmentCourse->assessment_course_id,
                'question_id' => $question->question_id,
                'participants_answer' => is_array($validated['answer'])
                    ? json_encode($validated['answer'])
                    : json_encode([$validated['answer']]),
                'score' => $score
            ]);
        
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
        //$assessmentCourse->initial_theta_score = // function to calculate 
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

        $selectedModules = session()->get("assessment_selected_modules");

        // get the current question's difficulty
        $currentDifficulty = $currentQuestion->difficulty->numeric;

        // Find a question that:
        // 1. Is in the selected courses
        // 2. Has not been used in this assessment
        // 3. Has a difficulty close to the current question
        $nextQuestion = Question::whereIn('course_id', $selectedModules)
            ->whereNotIn('question_id', function ($query) use ($assessment) {
                $query->select('question_id')
                    ->from('assessment_items')
                    ->join('assessment_courses', 'assessment_items.assessment_course_id', '=', 'assessment_courses.assessment_course_id')
                    ->where('assessment_courses.assessment_id', $assessment->assessment_id);
            })
            ->with(['question_detail', 'course', 'difficulty'])
            ->where(function ($query) use ($currentDifficulty) {
                // Select questions within ±1 difficulty level of the current question
                $query->whereBetween('difficulty_id', [
                    max(1, $currentDifficulty - 1),
                    min(5, $currentDifficulty + 1) 
                ]);
            })
            ->inRandomOrder()
            ->first();

        return $nextQuestion;
    }

    // for scores only
    private function calculateQuestionScore($questionType, $participantAnswer, $correctAnswer)
    {
        try {
            Log::debug('calculateQuestionScore input:', [
                'type' => $questionType,
                'participant_answer' => $participantAnswer,
                'correct_answer' => $correctAnswer
            ]);

            //removing extra quotations
            $correctAnswer = is_string($correctAnswer)
                ? trim($correctAnswer, '"')
                : $correctAnswer;

            switch ($questionType) {
                case 'Identification':
                case 'Multiple Choice - Single':
                    $participantText = is_array($participantAnswer) ? $participantAnswer[0] : $participantAnswer;
                    $correctText = is_array($correctAnswer) ? $correctAnswer[0] : $correctAnswer;

                    //normalization
                    $participantText = strtolower(trim((string) $participantText));
                    $correctText = strtolower(trim((string) $correctText));

                    $participantText = preg_replace('/\s+/', ' ', $participantText);
                    $correctText = preg_replace('/\s+/', ' ', $correctText);

                    $score = $participantText === $correctText ? 1 : 0;
                    break;

                case 'Multiple Choice - Many':
                    $participantAnswers = is_array($participantAnswer) ? $participantAnswer : [$participantAnswer];
                    $correctAnswers = is_array($correctAnswer) ? $correctAnswer : [$correctAnswer];

                    // normalize
                    $participantAnswers = array_map(function ($ans) {
                        return strtolower(trim(trim((string) $ans), '"'));
                    }, $participantAnswers);

                    $correctAnswers = array_map(function ($ans) {
                        return strtolower(trim(trim((string) $ans), '"'));
                    }, $correctAnswers);

                    sort($participantAnswers);
                    sort($correctAnswers);

                    $score = (json_encode($participantAnswers) === json_encode($correctAnswers)) ? 1 : 0;
                    break;

                default:
                    Log::warning("Unknown question type: $questionType");
                    $score = 0;
            }

            Log::debug('Score calculated:', [
                'type' => $questionType,
                'score' => $score
            ]);

            return $score;

        } catch (\Exception $e) {
            Log::error('Error in calculateQuestionScore: ' . $e->getMessage());
            return 0;
        }
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

    public function testHistory(Request $request)
    {
        $studentId = Auth::user()->userable->student_id;

        $tests = Assessment::where('student_id', $studentId)
            ->orderBy('created_at', 'desc')
            ->paginate(4);

        $testsArray = $tests->toArray();

        return Inertia::render('Student/TestHistory', [
            'title' => 'Student Test',
            'tests' => AssessmentResource::collection($tests),
            'paginationLinks' => $testsArray['links'],
        ]);
    }


}
