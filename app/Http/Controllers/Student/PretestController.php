<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
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

    public function startPretest()
    {
        $student = Student::find(Auth::user()->userable->student_id);

        //fetch pretest courses ang question details
        $courses = Course::with([
            'questions' => function ($query) {
                $query->where('question_type', 'Test')
                    ->with('question_details');
            }
        ])->get();

        $coursesData = CourseResource::collection($courses)->additional([
            'questions' => $courses->map(function ($course) {
                return [
                    'course_id' => $course->course_id,
                    'questions' => QuestionResource::collection($course->questions)
                ];
            })
        ]);

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

        return Inertia::render('Student/Pretest/Pretest', [
            'courses' => $coursesData,
            'student' => $student
        ]);
    }


    public function submit(Request $request)
    {
        $assessment = Assessment::findOrFail($request->assessment_id);

        // Calculate scores and create assessment items
        foreach ($request->answers as $questionId => $answer) {
            $question = Question::with('question_details')->find($questionId);
            $isCorrect = strtolower($answer) === strtolower($question->question_details->answer);

            AssessmentItem::create([
                'assessment_id' => $assessment->id,
                'question_id' => $questionId,
                'participant_answer' => $answer,
                'score' => $isCorrect ? 1 : 0,
            ]);
        }

        // Update assessment record
        $assessment->update([
            'end_time' => now(),
            'status' => 'Completed',
            'total_items' => count($request->answers),
            'total_score' => AssessmentItem::where('assessment_id', $assessment->id)
                ->sum('score'),
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Pretest completed successfully!');
    }
}