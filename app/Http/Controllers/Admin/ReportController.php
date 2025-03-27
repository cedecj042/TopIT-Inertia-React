<?php

namespace App\Http\Controllers\Admin;

use App\Enums\QuestionDifficulty;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\Question;
use App\Models\QuestionRecalibrationLog;
use App\Models\Student;
use App\Models\StudentCourseTheta;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    //

    public function index()
    {

        $query = Student::query()
            ->select(['student_id', 'firstname', 'lastname', 'year', 'school', 'created_at', DB::raw("CONCAT(students.firstname, ' ', students.lastname) AS name")]);

        $sort = request()->query('sort', ''); // Empty by default
        $sortField = $sortDirection = null;  // Initialize sortField and sortDirection as null

        // Only split if $sort is not empty
        if (!empty($sort)) {
            [$sortField, $sortDirection] = explode(':', $sort);

            // Ensure sortDirection is either 'asc' or 'desc', otherwise set it to null
            if (!in_array($sortDirection, ['asc', 'desc'])) {
                $sortDirection = null;
            }
        }
        // Filter by name (firstname, lastname, or concatenated name)
        if ($name = request('name')) {
            $query->where(function ($q) use ($name) {
                $q->where('firstname', 'like', '%' . $name . '%')
                    ->orWhere('lastname', 'like', '%' . $name . '%')
                    ->orWhere(DB::raw("CONCAT(firstname, ' ', lastname)"), 'like', '%' . $name . '%');
            });
        }

        // Filter by year
        if (request('year')) {
            $year = request('year');
            $query->where('year', $year);
        }

        if (request('school')) {
            $school = request('school');
            $query->where('school', $school);
        }
        if (!empty($sortField) && !empty($sortDirection)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $perPage = request('items', 5);

        $students = $query->paginate($perPage)->onEachSide(1);

        $thetaScores = StudentCourseTheta::with('course') // Assuming a relationship exists
            ->selectRaw('course_id, MAX(theta_score) as high_score, MIN(theta_score) as low_score, AVG(theta_score) as avg_score')
            ->groupBy('course_id')
            ->get()
            ->map(function ($theta) {
                return [
                    'course_title' => $theta->course->title ?? 'Unknown Course', // Avoid null issues
                    'course_id' => $theta->course_id,
                    'high_score' => $theta->high_score,
                    'low_score' => $theta->low_score,
                    'avg_score' => $theta->avg_score,
                ];
            });

        $highlowData = [
            'labels' => $thetaScores->pluck('course_title')->toArray(),
            'high' => $thetaScores->pluck('high_score')->toArray(),
            'low' => $thetaScores->pluck('low_score')->toArray(),
            'avg' => $thetaScores->pluck('avg_score')->toArray(),
        ];

        $difficultyCounts = Question::selectRaw('difficulty_type, COUNT(*) as count')
            ->groupBy('difficulty_type')
            ->pluck('count', 'difficulty_type');

        // Ensure all difficulty types are included in the response
        $labels = [];
        $counts = [];

        foreach (QuestionDifficulty::cases() as $difficulty) {
            $labels[] = $difficulty->value;
            $counts[] = $difficultyCounts[$difficulty->value] ?? 0;
        }
        $difficultyDistribution = [
            'labels'=> $labels,
            'data'=> $counts
        ];

        $schools = DB::table('students')->distinct()->pluck('school');
        $years = DB::table('students')->distinct()->orderBy('year', 'asc')->pluck('year');
        $filters = [
            'schools' => $schools,
            'years' => $years,
        ];

        $discriminationIndex = QuestionRecalibrationLog::with('question:question_id,question')
        ->select('question_id', 'previous_discrimination_index', 'new_discrimination_index')
        ->get()
        ->map(function ($log) {
            return [
                'question' => $log->question->question ?? 'Unknown',
                'previous' => $log->previous_discrimination_index,
                'new' => $log->new_discrimination_index,
            ];
        });

        return Inertia::render('Admin/Reports', [
            'title' => 'Admin Reports',
            'highlowData' => $highlowData,
            'difficultyDistribution' => $difficultyDistribution,
            'discriminationIndex' => $discriminationIndex,
            'students' => StudentResource::collection($students),
            'queryParams' => request()->query() ?: null,
            'filters' => $filters,
        ]);
    }
    public function student($studentId)
    {
        $student = Student::find($studentId);

        // Fetch StudentCourseTheta data with courses
        $coursesTheta = StudentCourseTheta::where('student_id', $studentId)
            ->with('course') // Eager load the course relationship
            ->get();

        // Prepare data for the ThetaScoreLine component
        $thetaScoreData = [
            'labels' => $coursesTheta->pluck('course.title')->toArray(), // Get course titles
            'data' => $coursesTheta->pluck('theta_score')->toArray(), // Get theta scores
        ];

        return Inertia::render('Admin/Student', [
            'title' => 'Admin Reports',
            'student' => new StudentResource($student),
            'queryParams' => request()->query() ?: null,
            'theta_score' => $thetaScoreData, // Pass structured data for the chart
        ]);
    }

}
