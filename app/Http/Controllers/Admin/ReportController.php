<?php

namespace App\Http\Controllers\Admin;

use App\Enums\QuestionDifficulty;
use App\Enums\QuestionType;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\AssessmentCourse;
use App\Models\Course;
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


        $schools = DB::table('students')->distinct()->pluck('school');
        $years = DB::table('students')->distinct()->orderBy('year', 'asc')->pluck('year');
        $filters = [
            'schools' => $schools,
            'years' => $years,
        ];


        return Inertia::render('Admin/Reports', [
            'title' => 'Admin Reports',
            'highlowData' => $highlowData,
            'difficultyDistribution' => $this->getQuestionData(),
            'questionLogsData' => $this->getQuestionComparisonData(),
            'totalAssessmentCourses' => $this->getTotalAssessmentCourses(),
            'students' => StudentResource::collection($students),
            'queryParams' => request()->query() ?: null,
            'filters' => $filters,
        ]);
    }
    public function student($studentId)
    {
        $student = Student::find($studentId);

        $coursesTheta = StudentCourseTheta::where('student_id', $studentId)
            ->with('course')
            ->get();

        $thetaScoreData = [
            'labels' => $coursesTheta->pluck('course.title')->toArray(),
            'data' => $coursesTheta->pluck('theta_score')->toArray(),
        ];

        return Inertia::render('Admin/Student', [
            'title' => 'Admin Reports',
            'student' => new StudentResource($student),
            'queryParams' => request()->query() ?: null,
            'theta_score' => $thetaScoreData, // Pass structured data for the chart
        ]);
    }
    public function getQuestionComparisonData()
    {
        $logs = QuestionRecalibrationLog::with('question')
            ->latest('created_at')
            ->limit(30)
            ->get();

        $chartData = $logs->map(function ($log) {
            return [
                'question' => $log->question->question ?? 'Unknown',
                'previous_discrimination_index' => $log->previous_discrimination_index,
                'new_discrimination_index' => $log->new_discrimination_index,
                'previous_difficulty_value' => $log->previous_difficulty_value,
                'new_difficulty_value' => $log->new_difficulty_value,
            ];
        });

        return $chartData;
    }
    private function getQuestionData()
    {
        $difficultyCounts = Question::selectRaw('difficulty_type, COUNT(*) as count')
            ->groupBy('difficulty_type')
            ->pluck('count', 'difficulty_type');

        $questionTypeCounts = Question::selectRaw('difficulty_type, question_type, COUNT(*) as count')
            ->groupBy('difficulty_type', 'question_type')
            ->get()
            ->groupBy('difficulty_type');

        $labels = QuestionDifficulty::cases();
        $totalCounts = [];
        $questionTypeData = [];

        // Initialize questionTypeData as an array of arrays
        foreach (QuestionType::cases() as $type) {
            $questionTypeData[$type->value] = [];
        }

        foreach ($labels as $difficulty) {
            $difficultyValue = $difficulty->value;
            $totalCounts[] = $difficultyCounts[$difficultyValue] ?? 0;

            foreach (QuestionType::cases() as $type) {
                $questionTypeData[$type->value][] = isset($questionTypeCounts[$difficultyValue])
                    ? $questionTypeCounts[$difficultyValue]->where('question_type', $type->value)->sum('count')
                    : 0;
            }
        }

        return [
            'labels' => array_map(fn($d) => $d->value, $labels),
            'totalCounts' => $totalCounts,
            'questionTypeData' => $questionTypeData
        ];
    }

    private function getTotalAssessmentCourses()
    {
        $courses = Course::all()->pluck('title'); // Get all course names as labels
        $courseCounts = Course::withCount('assessment_courses') // Count related assessment courses
            ->get()
            ->pluck('assessment_courses_count', 'title');

        return [
            'labels' => $courses->toArray(),  // X-axis: All course names
            'data' => $courses->map(fn($name) => $courseCounts[$name] ?? 0)->toArray(), // Y-axis: Total courses taken (0 if none)
        ];
    }





}
