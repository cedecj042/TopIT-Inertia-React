<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Http\Resources\UserResource;
use App\Models\Course;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $query = User::query();
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


        $averageScores = DB::table('student_course_thetas') // Correct table name
            ->join('courses', 'student_course_thetas.course_id', '=', 'courses.course_id')
            ->select('courses.title as course_title', DB::raw('AVG(student_course_thetas.theta_score) as avg_theta_score'))
            ->groupBy('courses.course_id', 'courses.title')
            ->get();

        // Format the results into the desired array structure
        $averageTheta = [
            'labels' => $averageScores->pluck('course_title')->toArray(),
            'data' => $averageScores->pluck('avg_theta_score')->toArray()
        ];

        $monthlyCounts = User::where('userable_type', 'App\\Models\\Student')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(*) as count'))
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->get()
            ->pluck('count', 'month');

        $schools = DB::table('students')->distinct()->pluck('school');
        $years = DB::table('students')->distinct()->orderBy('year', 'asc')->pluck('year');
        $filters = [
            'schools' => $schools,
            'years' => $years,
        ];

        $chartData = $this->prepareChartData($monthlyCounts);

        return Inertia::render(
            'Admin/Dashboard',
            [
                'auth' => Auth::user(),
                'title' => 'Admin Dashboard',
                'students' => StudentResource::collection($students),
                'queryParams' => request()->query() ?: null,
                'chartData' => $chartData,
                'thetaScoreData' => $averageTheta,
                'filters' => $filters,
            ]
        );
    }
    private function prepareChartData($monthlyCounts)
    {
        $filledMonthlyCounts = array_fill(1, 12, 0);

        foreach ($monthlyCounts as $month => $count) {
            $filledMonthlyCounts[$month] = $count;
        }

        return [
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'data' => array_values($filledMonthlyCounts),
        ];
    }

    public function showStudentDetails($studentId)
    {
        $student = Student::find($studentId);
        $averageThetaScore = DB::table('assessment_courses')
            ->select('courses.title as course_title', DB::raw('AVG(assessment_courses.theta_score) as avg_theta_score'))
            ->join('assessments', 'assessment_courses.assessment_id', '=', 'assessments.assessment_id')
            ->join('students', 'assessments.student_id', '=', 'students.student_id')
            ->join('courses', 'assessment_courses.course_id', '=', 'courses.course_id')
            ->where('students.student_id', $studentId)
            ->groupBy('courses.title')
            ->get();

        $averageTheta = [
            'labels' => $averageThetaScore->pluck('course_title')->toArray(),
            'data' => $averageThetaScore->pluck('avg_theta_score')->toArray()
        ];

        return Inertia::render('Admin/Student', [
            'auth' => Auth::user(),
            'title' => 'Admin Dashboard',
            'averageThetaScore' => $averageTheta,
            'student' => new StudentResource($student),
            'queryParams' => request()->query() ?: null,
        ]);
    }
    public function getStudents()
    {
        $query = Student::query()
            ->select(['student_id', 'firstname', 'lastname', 'year', 'school', 'created_at', DB::raw("CONCAT(students.firstname, ' ', students.lastname) AS name")]);

        $sort = request()->query('sort', ''); // Default empty
        $sortField = $sortDirection = null;

        // Only split if $sort is not empty
        if (!empty($sort)) {
            [$sortField, $sortDirection] = explode(':', $sort);

            // Ensure sortDirection is valid
            if (!in_array($sortDirection, ['asc', 'desc'])) {
                $sortDirection = null;
            }
        }

        // Apply filters
        if ($name = request('name')) {
            $query->where(function ($q) use ($name) {
                $q->where('firstname', 'like', '%' . $name . '%')
                    ->orWhere('lastname', 'like', '%' . $name . '%')
                    ->orWhere(DB::raw("CONCAT(firstname, ' ', lastname)"), 'like', '%' . $name . '%');
            });
        }

        if ($year = request('year')) {
            $query->where('year', $year);
        }

        if ($school = request('school')) {
            $query->where('school', $school);
        }

        if (!empty($sortField) && !empty($sortDirection)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $perPage = request('items', 5);

        $students = $query->paginate($perPage);

        return response()->json([
            'students' => $students,
            'queryParams' => request()->query(),
        ]);
    }
}
