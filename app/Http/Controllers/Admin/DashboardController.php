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
        $query = User::query()
            ->where('userable_type', 'App\\Models\\Student')
            ->join('students', 'users.userable_id', '=', 'students.student_id')
            ->select('users.*'); // Selecting users fields

        // Filter by name (firstname, lastname, or both)
        if (request('name')) {
            $name = request('name');
            $query->where(function ($q) use ($name) {
                $q->where('students.firstname', 'like', '%' . $name . '%')
                    ->orWhere('students.lastname', 'like', '%' . $name . '%')
                    ->orWhereRaw("CONCAT(students.firstname, ' ', students.lastname) LIKE ?", ['%' . $name . '%']);
            });
        }

        // Filter by year
        if (request('year')) {
            $year = request('year');
            $query->where('students.year', $year);
        }

        // Filter by school
        if (request('school')) {
            $school = request('school');
            $query->where('students.school', $school);
        }

        $query->orderByRaw("CONCAT(students.firstname, ' ', students.lastname) desc");


        $perPage = request('items', 5);

        $students = $query->paginate($perPage)->onEachSide(1);

        $students->load('userable');


        $averageScores = DB::table('test_courses')
            ->join('courses', 'test_courses.course_id', '=', 'courses.course_id')
            ->select('courses.title as course_title', DB::raw('AVG(test_courses.theta_score) as avg_theta_score'))
            ->groupBy('courses.title')
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
        $successMessage = session('success');

        return Inertia::render(
            'Admin/Dashboard',
            [
                'auth' => Auth::user(),
                'title' => 'Admin Dashboard',
                'students' => UserResource::collection($students),
                'queryParams' => request()->query() ?: null,
                'chartData' => $chartData,
                'thetaScoreData' => $averageTheta,
                'filters' => $filters,
                'flash' => [
                    'success' => $successMessage,
                ],
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
        $averageThetaScore = DB::table('test_courses')
            ->select('courses.title as course_title', DB::raw('AVG(test_courses.theta_score) as avg_theta_score'))
            ->join('tests', 'test_courses.test_id', '=', 'tests.test_id')
            ->join('students', 'tests.student_id', '=', 'students.student_id')
            ->join('courses', 'test_courses.course_id', '=', 'courses.course_id')
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
}
