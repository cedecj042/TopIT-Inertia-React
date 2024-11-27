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

        $assessment = Assessment::create([
            'student_id' => $student->student_id,
            'type' => 'Test',
            'status' => 'In Progress',
            'start_time' => now(),
            'total_items' => 0,
            'total_score' => 0,
            'percentage' => 0,
        ]);

        foreach ($selectedModules as $courseId) {
            AssessmentCourse::create([
                'assessment_id' => $assessment->assessment_id,
                'course_id' => $courseId,
                'status' => 'In Progress',
                'total_items' => 0,
                'total_score' => 0,
                //initial to be updated
                'initial_theta_score' => 0,
                'final_theta_score' => 0,
                'percentage' => 0
            ]);
        }

        return redirect()->route('test.page', ['assessmentId' => $assessment->assessment_id]);
    }
    public function showTestPage($assessmentId)
    {
        $assessment = Assessment::with(['assessment_courses', 'student'])->findOrFail($assessmentId);
        $selectedModules = session()->get("assessment_selected_modules");

        Log::info('Retrieved Modules from Session', [
            'selected_modules' => $selectedModules
        ]);

        $question = $this->selectInitialQuestion($selectedModules, $assessment->student);

        Log::info("Selected Question Details", [
            'question_course_id' => $question ? $question->course_id : 'No question found',
            'selected_module_ids' => $selectedModules
        ]);

        Log::info("Initial question details", [
            'question_id' => $question->question_id,
            'course_id' => $question->course_id,
            'difficulty' => $question->question_detail->difficulty ?? null
        ]);

        return Inertia::render('Student/Test/Test', [
            'assessment' => $assessment,
            'question' => $question,
        ]);
    }

    protected function selectInitialQuestion(array $courseIds, Student $student)
    {
        // for testing purposes
        $question = Question::whereIn('course_id', $courseIds)
            ->whereHas('difficulty', function ($query) {
                $query->where('name', 'average');
            })
            ->with(['question_detail', 'course'])
            ->inRandomOrder()
            ->first();

        return $question;
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
