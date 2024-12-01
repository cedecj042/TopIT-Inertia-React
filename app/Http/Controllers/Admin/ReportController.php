<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Http\Resources\StudentThetaScore;
use App\Models\Student;
use App\Models\StudentCourseTheta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    //

    public function index(){

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
        
        $thetaScores = DB::table('student_course_thetas')
            ->join('courses', 'student_course_thetas.course_id', '=', 'courses.course_id')
            ->select(
                'courses.title as course_title', // Course title
                'student_course_thetas.course_id', // Course ID
                DB::raw('MAX(student_course_thetas.theta_score) as high_score'), // High score
                DB::raw('MIN(student_course_thetas.theta_score) as low_score'), // Low score
                DB::raw('AVG(student_course_thetas.theta_score) as avg_score')  // Average score
            )
            ->groupBy('student_course_thetas.course_id', 'courses.title') // Group by course ID and course title
            ->get();

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

        return Inertia::render('Admin/Reports',[
            'title' => 'Admin Reports',
            'auth' => Auth::user(),
            'highlowData' => $highlowData,
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
            'auth' => Auth::user(),
            'title' => 'Admin Reports',
            'student' => new StudentResource($student),
            'queryParams' => request()->query() ?: null,
            'theta_score' => $thetaScoreData, // Pass structured data for the chart
        ]);
    }

}
