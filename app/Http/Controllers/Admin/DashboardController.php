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
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $query = User::query();
        $query = User::query()->where('userable_type', 'App\\Models\\Student')->with('userable');;

        if (request('name')) {
            $name = request('name');
            $query->whereHas('userable', function ($q) use ($name) {
                $q->where('firstname', 'like', '%' . $name . '%')
                    ->orWhere('lastname', 'like', '%' . $name . '%')
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ['%' . $name . '%']);
            });
        }

        if (request('year')) {
            $year = request('year');
            $query->whereHasMorph('userable', [Student::class], function ($q) use ($year) {
                $q->where('year', $year); // Apply the year condition only to the 'students' table
            });
        }
        if (request('school')) {
            $school = request('school');
            $query->whereHasMorph('userable', [Student::class], function ($q) use ($school) {
                $q->where('school', $school); // Apply the year condition only to the 'students' table
            });
        }

        // Determine the pagination count
        $perPage = request('items', 5);

        //Paginate Students
        $students = $query->paginate($perPage)->onEachSide(1);


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
        $years = DB::table('students')->distinct()->orderBy('year','asc')->pluck('year');
        $filters = [
            'schools' => $schools,
            'years' => $years,
        ];

        $chartData = $this->prepareChartData($monthlyCounts);

        
        return Inertia::render(
            'Admin/Dashboard',
            [
                'title' => 'Admin Dashboard',
                'auth' => [
                    'user' => Auth::user(),
                ],
                'students' => UserResource::collection($students),
                'queryParams' => request()->query() ?: null,
                'chartData' => $chartData,
                'thetaScoreData' => $averageTheta,
                'filters'=> $filters,
            ]
        );
    }
    private function prepareChartData($monthlyCounts)
    {

        // Fill the array with 0 counts for months that have no data
        $filledMonthlyCounts = array_fill(1, 12, 0); // Array from 1 to 12 for each month

        foreach ($monthlyCounts as $month => $count) {
            $filledMonthlyCounts[$month] = $count;
        }

        return [
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'data' => array_values($filledMonthlyCounts),
        ];
    }

    
}
