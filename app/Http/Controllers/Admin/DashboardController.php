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
        $monthlyCounts = User::where('userable_type', 'App\\Models\\Student')
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('COUNT(*) as count'))
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->get()
            ->pluck('count', 'month');

        
        $questionCounts = DB::table('questions')
            ->select('test_type', DB::raw('COUNT(*) as total'))
            ->whereIn('test_type', ['Pretest', 'Test']) // Filter only for 'Pretest' and 'Test'
            ->groupBy('test_type')
            ->pluck('total', 'test_type');

        $cards = [
            'Total Students' => DB::table('students')->count(),
            'Total Courses' => DB::table('courses')->count(),
            'Test Questions' => $questionCounts['Test'] ?? 0, // Default to 0 if no test questions
            'Pretest Questions' => $questionCounts['Pretest'] ?? 0, // Default to 0 if no pretest questions
        ];

        $chartData = $this->prepareChartData($monthlyCounts);

        return Inertia::render(
            'Admin/Dashboard',
            [
                'auth' => Auth::user(),
                'title' => 'Admin Dashboard',
                'chartData' => $chartData,
                'cards'=> $cards,
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

    
    // public function getStudents()
    // {
    //     $query = Student::query()
    //         ->select(['student_id', 'firstname', 'lastname', 'year', 'school', 'created_at', DB::raw("CONCAT(students.firstname, ' ', students.lastname) AS name")]);

    //     $sort = request()->query('sort', ''); // Default empty
    //     $sortField = $sortDirection = null;

    //     // Only split if $sort is not empty
    //     if (!empty($sort)) {
    //         [$sortField, $sortDirection] = explode(':', $sort);

    //         // Ensure sortDirection is valid
    //         if (!in_array($sortDirection, ['asc', 'desc'])) {
    //             $sortDirection = null;
    //         }
    //     }

    //     // Apply filters
    //     if ($name = request('name')) {
    //         $query->where(function ($q) use ($name) {
    //             $q->where('firstname', 'like', '%' . $name . '%')
    //                 ->orWhere('lastname', 'like', '%' . $name . '%')
    //                 ->orWhere(DB::raw("CONCAT(firstname, ' ', lastname)"), 'like', '%' . $name . '%');
    //         });
    //     }

    //     if ($year = request('year')) {
    //         $query->where('year', $year);
    //     }

    //     if ($school = request('school')) {
    //         $query->where('school', $school);
    //     }

    //     if (!empty($sortField) && !empty($sortDirection)) {
    //         $query->orderBy($sortField, $sortDirection);
    //     }

    //     $perPage = request('items', 5);

    //     $students = $query->paginate($perPage);

    //     return response()->json([
    //         'students' => $students,
    //         'queryParams' => request()->query(),
    //     ]);
    // }
}
