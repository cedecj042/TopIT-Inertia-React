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
                $query->where('question_type', 'Test')
                    ->with('question_detail');
            }
        ])->get();

        $assessment = Assessment::create([
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
                'assessment_id' => $assessment->assessment_id,
                'status' => $assessment->status,
                'start_time' => $assessment->start_time,
                'type' => $assessment->type
            ],
            'student' => $student
        ]);
    }



    public function submit(Request $request)
    {
        try {
            Log::info('Pretest submission data: ', $request->all());

            $validated = $request->validate([
                'assessment_id' => 'required|exists:assessments,assessment_id',
                'answers' => 'required|array'
            ]);

            DB::beginTransaction();

            // 1. Fetch assessment and check status
            $assessment = Assessment::where('assessment_id', $validated['assessment_id'])
                ->where('status', '!=', 'Completed')
                ->firstOrFail();

            $student = Student::findOrFail($assessment->student_id);

            // \Log::info('assessment and student found', [
            //     'assessment_id' => $assessment->assessment_id,
            //     'student_id' => $student->student_id
            // ]);

            // 2. Received ans from post
            Log::info('Submitted answers:', $validated['answers']);

            // 3. Process answers and update assessment details
            $totalScore = 0;
            $totalItems = 0;

            foreach ($validated['answers'] as $questionId => $participantAnswer) {
                $question = Question::with(['question_detail', 'course'])
                    ->findOrFail($questionId);

                if (!$question->question_detail) {
                    \Log::info('Question detail not found for question ID: ' . $questionId);
                    continue;
                }


                #get correct answer
                $correctAnswer = json_decode($question->question_detail->answer, true);

                #scoring logic temp (no theta yet)
                $score = $this->calculateQuestionScore($question->question_detail->type, $participantAnswer, $correctAnswer);

                #storing to assessmentitem
                AssessmentItem::create([
                    'assessment_course_id' => $this->getAssessmentCourseId($assessment->assessment_id, $question->course_id),
                    'question_id' => $questionId,
                    'participants_answer' => json_encode($participantAnswer),
                    'score' => $score
                ]);

                $totalScore += $score;
                $totalItems++;
            }

            // 4. Update assessment and assessment course details
            $assessment->update([
                'end_time' => now(),
                'status' => 'Completed',
                'total_items' => $totalItems,
                'total_score' => $totalScore,
                'percentage' => ($totalItems > 0) ? ($totalScore / $totalItems) * 100 : 0
            ]);

            $this->updateAssessmentCourses($assessment->assessment_id);

            DB::commit();

            return redirect()->route('dashboard')->with('success', 'Pretest completed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Pretest submission error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return back()->with('error', 'An error occurred while submitting your pretest. Please try again.');
        }
    }

    private function calculateQuestionScore($questionType, $participantAnswer, $correctAnswer)
    {
        $score = 0;

        switch ($questionType) {
            case 'Identification':
                $score = strtolower(trim($participantAnswer)) === strtolower(trim($correctAnswer[0])) ? 1 : 0;
                break;
            case 'Multiple Choice - Single':
                $score = strtolower($participantAnswer) === strtolower($correctAnswer[0]) ? 1 : 0;
                break;
            case 'Multiple Choice - Many':
                $participantAnswers = is_array($participantAnswer) ? $participantAnswer : [];
                $correctAnswers = is_array($correctAnswer) ? $correctAnswer : json_decode($correctAnswer, true);

                // sort arrays for correct ans
                sort($participantAnswers);
                sort($correctAnswers);

                $score = (json_encode($participantAnswers) === json_encode($correctAnswers)) ? 1 : 0;
                break;
        }

        return $score;
    }

    private function getAssessmentCourseId($assessmentId, $courseId)
    {
        $assessmentCourse = AssessmentCourse::where('assessment_id', $assessmentId)
            ->where('course_id', $courseId)
            ->first();

        if (!$assessmentCourse) {
            $assessmentCourse = AssessmentCourse::create([
                'assessment_id' => $assessmentId,
                'course_id' => $courseId,
                'total_items' => 0,
                'total_score' => 0,
                'percentage' => 0,
                'theta_score' => 0,
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
                'percentage' => ($totalItems > 0) ? ($totalScore / $totalItems) * 100 : 0
            ]);
        }
    }





}