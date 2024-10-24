<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Course;
use App\Models\Question;
use App\Models\Pretest;
use App\Models\PretestCourse;
use App\Models\PretestQuestion;
use App\Models\PretestAnswer;
use App\Http\Resources\PretestResource;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PretestController extends Controller
{
    public function welcome()
    {
        return Inertia::render('Student/Pretest/Welcome', [
            'auth' => [
                'user' => Auth::user()->userable->firstname,
            ],
        ]);
    }

    public function startPretest()
    {
        Session::forget('pretest_progress');
        Session::forget('pretest_answers');

        $courses = Course::all();

        $pretestProgress = [
            'current_course_index' => 0,
            'courses' => $courses->pluck('course_id')->toArray(),
        ];

        Session::put('pretest_progress', $pretestProgress);

        return Inertia::location(route('pretest.questions'));
    }

    public function showQuestions($courseIndex = null)
    {
        $progress = Session::get('pretest_progress');
        $answers = Session::get('pretest_answers', []);

        if ($courseIndex !== null) {
            $progress['current_course_index'] = $courseIndex;
            Session::put('pretest_progress', $progress);
        }

        $currentCourseId = $progress['courses'][$progress['current_course_index']];
        
        $course = Course::findOrFail($currentCourseId);
        $coursesData = Course::all();

        $questions = PretestQuestion::whereHas('questions.courses', function ($query) use ($currentCourseId) {
            $query->where('course_id', $currentCourseId);
        })
            ->with(['questions.questionable', 'questions.difficulty'])
            // ->take(5)
            ->get();

        $isLastCourse = $progress['current_course_index'] == count($progress['courses']) - 1;


        return Inertia::render('Student/Pretest/Pretest', [
            'course' => $course,
            'questions' => $questions,
            'answers' => $answers,
            'currentCourseIndex' => $progress['current_course_index'] + 1,
            'totalCourses' => count($progress['courses']),
            'isLastCourse' => $isLastCourse,
            'coursesData' => $coursesData,
        ]);
    }

    public function submitAnswers(Request $request)
    {
        $progress = Session::get('pretest_progress');
        $answers = Session::get('pretest_answers', []);

        foreach ($request->input('answers', []) as $questionId => $answer) {
            $answers[$questionId] = $answer;
        }

        Session::put('pretest_answers', $answers);

        $progress['current_course_index']++;
        Session::put('pretest_progress', $progress);

        if ($progress['current_course_index'] >= count($progress['courses'])) {
            return $this->finishAttempt();
        }

        return Inertia::location(route('pretest.questions'));
    }

    public function finishAttempt()
    {
        $answers = Session::get('pretest_answers', []);
        $progress = Session::get('pretest_progress');
        $user = Auth::user();
        $student = $user->userable;
        $studentId = $student->student_id;

        if (!$studentId) {
            Log::warning('Attempt to store pretest attempt without an authenticated user.');
            return Inertia::location(route('login'));
        }

        $pretestId = DB::transaction(function () use ($answers, $progress, $studentId) {
            $pretest = Pretest::create([
                'student_id' => $studentId,
                'totalItems' => count($answers),
                'totalScore' => 0,
                'percentage' => 0,
                'status' => 'Completed'
            ]);

            $totalScore = 0;

            foreach ($progress['courses'] as $courseId) {
                $pretestCourse = PretestCourse::create([
                    'course_id' => $courseId,
                    'pretest_id' => $pretest->pretest_id,
                    'theta_score' => 0
                ]);

                $questions = PretestQuestion::whereHas('questions.courses', function ($query) use ($courseId) {
                    $query->where('course_id', $courseId);
                })->get();

                foreach ($questions as $question) {
                    $userAnswer = $answers[$question->question_id] ?? null;
                    $questionModel = $question->questions->questionable;
                    $correctAnswer = $questionModel->answer;

                    $score = $this->calculateScore($userAnswer, $correctAnswer, $questionModel);
                    $totalScore += $score;

                    PretestAnswer::create([
                        'pretest_course_id' => $pretestCourse->pretest_course_id,
                        'pretest_question_id' => $question->pretest_question_id,
                        'participants_answer' => json_encode($userAnswer),
                        'score' => $score
                    ]);
                }
            }

            $pretest->update([
                'totalScore' => $totalScore,
                'percentage' => ($totalScore / $pretest->totalItems) * 100
            ]);

            return $pretest->pretest_id;
        });

        Session::forget('pretest_answers');
        Session::forget('pretest_progress');
        Session::put('quiz_completed', true);

        return Inertia::location(route('pretest.finish', ['pretestId' => $pretestId]));
    }

    public function showFinishAttempt($pretestId)
    {
        $studentId = Auth::id();

        $pretest = Pretest::findOrFail($pretestId);
        $totalScore = $pretest->totalScore ?? 0;
        $totalQuestions = $pretest->totalItems ?? 0;

        return Inertia::render('Pretest/FinishAttempt', [
            'score' => $totalScore,
            'totalQuestions' => $totalQuestions,
            'pretestId' => $pretestId
        ]);
    }

    public function reviewPretest($pretestId)
    {
        $pretest = Pretest::with('pretest_courses.courses', 'pretest_courses.pretest_answers.pretest_question.questions')
            ->findOrFail($pretestId);

        // return Inertia::render('Pretest/Review', [
        //     'pretest' => new PretestResource($pretest),
        // ]);
    }

    private function calculateScore($userAnswer, $correctAnswer, $questionModel)
    {
        if (is_array($correctAnswer)) {
            $userAnswer = is_array($userAnswer) ? $userAnswer : [$userAnswer];

            sort($userAnswer);
            sort($correctAnswer);

            return (json_encode($userAnswer) === json_encode($correctAnswer)) ? 1 : 0;
        } else {
            return ($userAnswer === $correctAnswer) ? 1 : 0;
        }
    }
}