<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

use App\Models\Course;
use App\Models\Student;
use App\Models\Question;
use App\Models\QuestionDetail;
use App\Models\Assessment;
use App\Models\AssessmentItem;
use App\Models\AssessmentCourse;
use App\Http\Resources\CourseResource;

use App\Http\Resources\QuestionResource;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\StudentResource;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;


class PretestController extends Controller
{
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


    public function finish($assessmentId)
    {
        $assessment = Assessment::findOrFail($assessmentId);

        return Inertia::render('Student/Pretest/PretestFinish', [
            'score' => $assessment->total_score,
            'totalQuestions' => $assessment->total_items,
            'pretestId' => $assessment->assessment_id,
            'title' => "Finish"
        ]);
    }

    public function startPretest()
    {
        $student = Student::find(Auth::user()->userable->student_id);

        $courses = Course::with([
            'questions' => function ($query) {
                $query->where('test_type', 'Test')
                    ->with('question_detail');
            }
        ])->get();

        // checking to avoid duplicate
        $existingPretest = Assessment::where('student_id', $student->student_id)
            ->where('type', 'Pretest')
            ->where('status', 'In Progress')
            ->first();

        if (!$existingPretest) {
            $existingPretest = Assessment::create([
                'student_id' => $student->student_id,
                'type' => 'Pretest',
                'status' => 'In Progress',
                'start_time' => now(),
                'end_time' => null,
                'total_items' => $courses->sum(function ($course) {
                    return $course->questions->count();
                }),
                'total_score' => 0,
                'percentage' => 0
            ]);
        }

        $coursesData = CourseResource::collection($courses)->additional([
            'questions' => $courses->map(function ($course) {
                return [
                    'course_id' => $course->course_id,
                    'questions' => QuestionResource::collection($course->questions)
                ];
            })
        ]);

        return Inertia::render('Student/Pretest/Pretest', [
            'courses' => $coursesData,
            'assessment' => [
                'assessment_id' => $existingPretest->assessment_id,
                'status' => $existingPretest->status,
                'start_time' => $existingPretest->start_time,
                'type' => $existingPretest->type
            ],
            'student' => $student
        ]);
    }

    public function review($assessmentId)
    {
        $assessment = Assessment::with([
            'assessment_courses.assessment_items.question.question_detail',
            'assessment_courses.course',
            'assessment_courses.assessment_items'
        ])->findOrFail($assessmentId);

        // dd($assessment->toArray());


        $student = Student::find(Auth::user()->userable->student_id);

        $courses = Course::with([
            'questions' => function ($query) {
                $query->
                    with('question_detail');
            }
        ])->get();

        // Organize student answers by question ID for easy lookup
        $studentAnswers = collect();
        foreach ($assessment->assessment_courses as $assessmentCourse) {
            foreach ($assessmentCourse->assessment_items as $item) {
                $studentAnswers->put($item->question_id, [
                    'participants_answer' => $item->participants_answer ?? null,
                    'score' => $item->score,
                    'course_id' => $assessmentCourse->course_id
                ]);
            }
        }

        // Add student answers and correctness to the questions
        $coursesWithAnswers = $courses->map(function ($course) use ($studentAnswers) {
            $course->questions->transform(function ($question) use ($studentAnswers) {
                $studentAnswer = $studentAnswers->get($question->question_id);

                $decodedAnswer = $studentAnswer && !is_null($studentAnswer['participants_answer'])
                    ? json_decode($studentAnswer['participants_answer'], true)
                    : null;

                $question->student_answer = is_array($decodedAnswer)
                    ? (count($decodedAnswer) > 1 ? $decodedAnswer : $decodedAnswer[0] ?? null)
                    : null;

                $question->is_multiple_answer = is_array($decodedAnswer) && count($decodedAnswer) > 1;

                $question->is_correct = $studentAnswer ? $studentAnswer['score'] > 0 : false;

                logger()->info("Question: {$question}", [

                ]);
                return $question;
            });
            return $course;
        });

        $coursesData = CourseResource::collection($coursesWithAnswers)->additional([
            'questions' => $coursesWithAnswers->map(function ($course) {
                return [
                    'course_id' => $course->course_id,
                    'questions' => QuestionResource::collection($course->questions)
                ];
            }),
        ]);

        return Inertia::render('Student/Pretest/PretestReview', [
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

    public function submit(Request $request)
    {
        try {
            Log::info('Pretest submission data: ', $request->all());
            Log::info('Starting pretest submission', [
                'student_id' => Auth::user()->userable->student_id,
                'assessment_id' => $request->assessment_id
            ]);

            $validated = $request->validate([
                'assessment_id' => 'required|exists:assessments,assessment_id',
                'answers' => 'required|array'
            ]);

            DB::beginTransaction();

            $assessment = Assessment::where('assessment_id', $validated['assessment_id'])
                ->where('status', '!=', 'Completed')
                ->firstOrFail();

            $totalScore = 0;
            $totalItems = 0;

            foreach ($validated['answers'] as $questionId => $participantAnswer) {
                $question = Question::with(['question_detail', 'course'])
                    ->findOrFail($questionId);

                // deocding correct answer
                $correctAnswer = $question->question_detail->answer;
                if (is_string($correctAnswer)) {
                    $correctAnswer = json_decode($correctAnswer, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        Log::error('JSON decode error for correct answer: ' . json_last_error_msg());
                        continue;
                    }
                }

                // calculate score with proper answer formats
                $score = $this->calculateQuestionScore(
                    $question->question_detail->type,
                    $participantAnswer,
                    $correctAnswer
                );

                // store and encode participant answer 
                $assessmentItem = AssessmentItem::updateOrCreate(
                    [
                        'assessment_course_id' => $this->getAssessmentCourseId($assessment->assessment_id, $question->course_id),
                        'question_id' => $questionId
                    ],
                    [
                        'participants_answer' => is_array($participantAnswer) ? json_encode($participantAnswer) : json_encode([$participantAnswer]),
                        'score' => $score
                    ]
                );
    
                $totalScore += $assessmentItem->score;
                $totalItems++;
            }

            // assessment score
            $assessment->update([
                'end_time' => now(),
                'status' => 'Completed',
                'total_items' => $totalItems,
                'total_score' => $totalScore,
                'percentage' => ($totalItems > 0) ? ($totalScore / $totalItems) * 100 : 0,
                // to update
                'initial_theta_score' => 0,
                'final_theta_scoure' => 0
            ]);

            Log::info('Completed pretest submission after update', [
                'student_id' => Auth::user()->userable->student_id,
                'assessment_id' => $assessment->assessment_id,
                'total_score' => $totalScore,
                'total_items' => $totalItems
            ]);

            $this->updateAssessmentCourses($assessment->assessment_id);

            //update student table 
            $student = Student::findOrFail($assessment->student_id);
            $student->update(['pretest_completed' => true]);

            DB::commit();

            // !!
            return Inertia::render('Student/Pretest/PretestFinish', [
                'score' => $assessment->total_score,
                'totalQuestions' => $assessment->total_items,
                'pretestId' => $assessment->assessment_id,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Pretest submission error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return back()->with('error', 'An error occurred while submitting your pretest. Please try again.');
        }
    }

    private function calculateQuestionScore($questionType, $participantAnswer, $correctAnswer)
    {
        try {
            Log::debug('calculateQuestionScore input:', [
                'type' => $questionType,
                'participant_answer' => $participantAnswer,
                'correct_answer' => $correctAnswer
            ]);

            switch ($questionType) {
                case 'Identification':
                    $participantText = is_array($participantAnswer) ? $participantAnswer[0] : $participantAnswer;
                    $correctText = is_array($correctAnswer) ? $correctAnswer[0] : $correctAnswer;

                    #normalization
                    $participantText = strtolower(trim((string) $participantText));
                    $correctText = strtolower(trim((string) $correctText));

                    $participantText = preg_replace('/\s+/', ' ', $participantText);
                    $correctText = preg_replace('/\s+/', ' ', $correctText);

                    $score = $participantText === $correctText ? 1 : 0;
                    break;

                case 'Multiple Choice - Single':
                    $participantChoice = is_array($participantAnswer) ? $participantAnswer[0] : $participantAnswer;
                    $correctChoice = is_array($correctAnswer) ? $correctAnswer[0] : $correctAnswer;

                    $participantChoice = strtolower(trim((string) $participantChoice));
                    $correctChoice = strtolower(trim((string) $correctChoice));

                    $score = $participantChoice === $correctChoice ? 1 : 0;
                    break;

                case 'Multiple Choice - Many':
                    $participantAnswers = is_array($participantAnswer) ? $participantAnswer : [$participantAnswer];
                    $correctAnswers = is_array($correctAnswer) ? $correctAnswer : [$correctAnswer];

                    $participantAnswers = array_map(function ($ans) {
                        return strtolower(trim((string) $ans));
                    }, $participantAnswers);

                    $correctAnswers = array_map(function ($ans) {
                        return strtolower(trim((string) $ans));
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
    private function getAssessmentCourseId($assessmentId, $courseId)
    {
        $assessmentCourse = AssessmentCourse::where('assessment_id', $assessmentId)
            ->where('course_id', $courseId)
            ->first();

        Log::info('Creating assessment course:', [
            'assessment_id' => $assessmentId,
            'course_id' => $courseId,
            'total_items' => 0,
            'total_score' => 0,
            'percentage' => 0,
            'initial_theta_score' => 0,
            'final_theta_score' => 0,
        ]);


        if (!$assessmentCourse) {
            $assessmentCourse = AssessmentCourse::create([
                'assessment_id' => $assessmentId,
                'course_id' => $courseId,
                'total_items' => 0,
                'total_score' => 0,
                'percentage' => 0,
                'initial_theta_score' => 0, // Add this line
                'final_theta_score' => 0,
            ]);
        }

        return $assessmentCourse->assessment_course_id;
    }

    private function updateAssessmentCourses($assessmentId)
    {
        $assessmentCourses = AssessmentCourse::where('assessment_id', $assessmentId)->get();

        foreach ($assessmentCourses as $assessmentCourse) {
            $totalScore = AssessmentItem::where('assessment_course_id', $assessmentCourse->assessment_course_id)
                ->sum('score');
            $totalItems = AssessmentItem::where('assessment_course_id', $assessmentCourse->assessment_course_id)
                ->count();

            $assessmentCourse->update([
                'total_score' => $totalScore,
                'total_items' => $totalItems,
                'percentage' => ($totalItems > 0) ? ($totalScore / $totalItems) * 100 : 0,
                'initial_theta_score' => 0,
                'final_theta_score' => 0
            ]);

            //add student_courses_theta
        }
    }

}