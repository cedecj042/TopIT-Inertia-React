<?php

namespace App\Http\Controllers\Student;

use App\Http\Requests\StudentProfileRequest;
use App\Models\Student;
use App\Models\AssessmentCourse;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Log;
use Carbon\Carbon;

class StudentProfileController extends Controller
{
 
    public function showStudentDetails(Request $request)
    {
        $student = Auth::user()->userable;
        $selectedMonth = $request->input('month', now()->format('Y-m'));

        $progressData = $this->getCourseProgressData($student->student_id, $selectedMonth);

        return Inertia::render('Student/Profile', [
            'title' => 'Student Profile',
            'student' => new StudentResource($student),
            'progressData' => ['original' => $progressData['progressData']],
            'availableMonths' => $progressData['availableMonths'],
            'selectedMonth' => $selectedMonth
        ]);
    }

    public function getCourseProgressData($studentId, $selectedMonth = null)
    {
        $selectedMonth ?? now()->format('Y-m');
        $currentDate = now()->format('Y-m-d');

        $startOfMonth = Carbon::parse($selectedMonth)->startOfMonth();
        $endOfMonth = Carbon::parse($selectedMonth)->endOfMonth();

        $availableMonths = AssessmentCourse::whereHas('assessment', function ($query) use ($studentId) {
            $query->where('student_id', $studentId);
        })
            ->distinct()
            ->selectRaw('DATE_FORMAT(updated_at, "%Y-%m") as month')
            ->orderBy('month', 'desc')
            ->pluck('month');

        $thetaScores = AssessmentCourse::whereHas('assessment', function ($query) use ($studentId) {
            $query->where('student_id', $studentId);
        })
            ->select('course_id', 'final_theta_score', 'updated_at')
            ->with('course')
            ->whereBetween('updated_at', [$startOfMonth, $endOfMonth])
            ->orderBy('updated_at', 'asc')
            ->get();

        $dateRange = [];
        for ($date = $startOfMonth->copy(); $date <= $endOfMonth; $date->addDay()) {
            $dateRange[] = $date->format('Y-m-d');
        }

        $progressData = [
            'labels' => $dateRange,
            'datasets' => [],
            'selectedMonth' => $selectedMonth
        ];

        $thetaScores = $thetaScores->map(function ($item) {
            $item->date = $item->updated_at->format('Y-m-d');
            return $item;
        });

        $groupedScores = $thetaScores->groupBy('course.title');

        foreach ($groupedScores as $courseTitle => $scores) {
            $data = [];
            $lastValidScore = null;

            foreach ($dateRange as $label) {
                if ($label > $currentDate) {
                    $data[] = null;
                    continue;
                }

                $dailyScores = $scores->where('date', $label);

                if ($dailyScores->isNotEmpty()) {
                    $currentScore = $dailyScores->avg('final_theta_score');
                    $lastValidScore = $currentScore;
                    $data[] = $currentScore;
                } else {
                    $data[] = $lastValidScore;
                }
            }

            $progressData['datasets'][] = [
                'label' => $courseTitle,
                'data' => $data,
                'borderColor' => $this->generateRandomColor(),
                'backgroundColor' => 'rgba(75, 192, 192, 0.2)',
                'tension' => 0.3,
                'showLine' => true,
            ];
        }

        return [
            'progressData' => $progressData,
            'availableMonths' => $availableMonths,
        ];
    }

    public function generateRandomColor()
    {
        return sprintf('rgba(%d, %d, %d, 1)', rand(0, 255), rand(0, 255), rand(0, 255));
    }

    public function editProfile(StudentProfileRequest $request)
    {
        Log::info($request);
        try {
            $student = Auth::user()->userable;

            $validatedData = $request->validated();

            DB::transaction(function () use ($student, $validatedData) {
                if (isset($validatedData['profile_image'])) {
                    $profileImage = $validatedData['profile_image'];
                    $imageName = time() . '.' . $profileImage->extension();
                    $profileImage->storeAs('', $imageName, 'profile_images');

                    if ($student->profile_image) {
                        Storage::disk('profile_images')->delete($student->profile_image);
                    }

                    $validatedData['profile_image'] = $imageName;
                }

                $student->update($validatedData);
            });

            return redirect()->route('profile')->with('success', 'Profile updated successfully');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Profile update error: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while updating the profile. Please try again.');
        }
    }


}
