<?php

namespace App\Http\Controllers\Student;

use App\Models\Student;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Redirect;

class StudentProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function showStudentDetails()
    {
        $studentId = Student::find(Auth::user()->userable->student_id);

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

        return Inertia::render('Student/Profile', [
            'title' => 'Student Profile',
            'averageThetaScore' => $averageTheta,
            'student' => new StudentResource($studentId),
        ]);
    }

    public function editProfile(Request $request)
    {
        try {
            $student = Auth::user()->userable;

            $validatedData = $request->validate([
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'birthdate' => 'nullable|date',
                'gender' => ['required', Rule::in(['Male', 'Female', 'Others'])],
                'address' => 'nullable|string|max:500',
                'school' => 'nullable|string|max:255',
                'year' => 'nullable|string|max:50'
            ]);

            \Log::info('Validated data:', $validatedData);

            $updated = $student->update($validatedData);

            if (!$updated) {
                throw new \Exception('Failed to update profile');
            }

            return redirect()->route('profile')->with([
                'success' => 'Profile updated successfully',
                'student' => new StudentResource($student->fresh())
            ]);

        } catch (\Exception $e) {
            \Log::error('Profile update error: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

}
