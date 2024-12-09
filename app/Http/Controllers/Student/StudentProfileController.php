<?php

namespace App\Http\Controllers\Student;

use App\Http\Requests\StudentProfileRequest;
use App\Models\Student;
use App\Models\AssessmentCourse;
use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Log;

class StudentProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function showStudentDetails()
    {
        $student = Auth::user()->userable;
        $progressData = $this->getCourseProgressData($student->student_id);

        return Inertia::render('Student/Profile', [
            'title' => 'Student Profile',
            'student' => new StudentResource($student),
            'progressData' => $progressData
        ]);
    }

    public function getCourseProgressData($studentId)
    {
        $thetaScores = AssessmentCourse::whereHas('assessment', function ($query) use ($studentId) {
            $query->where('student_id', $studentId);
        })
            ->select('course_id', 'final_theta_score', 'updated_at')
            ->with('course')
            ->orderBy('updated_at', 'asc')
            ->get();

        // map `updated_at` to dates and group scores by course and date
        $thetaScores = $thetaScores->map(function ($item) {
            $item->date = $item->updated_at->format('Y-m-d'); 
            return $item;
        });

        // 7 day range until current date
        $currentDate = now();
        $dateRange = [];
        for ($i = 0; $i < 7; $i++) {
            $dateRange[] = $currentDate->copy()->subDays($i)->format('Y-m-d');
        }
        $dateRange = array_reverse($dateRange); //reverse to start from earliest
        Log::info('Date Range: ', $dateRange);

        $progressData = [
            'labels' => $dateRange, 
            'datasets' => [],
        ];

        // group scores by course title
        $groupedScores = $thetaScores->groupBy('course.title');

        Log::info('Grouped Scores: ', $groupedScores->toArray());

        foreach ($groupedScores as $courseTitle => $scores) {
            $data = []; 
            $currentThetaScore = $scores->first()->final_theta_score ?? 0;
            foreach ($dateRange as $label) {
                $dateScores = $scores->where('date', $label);
                if ($dateScores->isNotEmpty()) {
                    $currentThetaScore = $dateScores->avg('final_theta_score');
                }
                $data[] = $currentThetaScore;

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

        Log::info('Progress Data: ', $progressData);

        return response()->json($progressData);
    }

    public function generateRandomColor()
    {
        $randomColor = sprintf('rgba(%d, %d, %d, 1)', rand(0, 255), rand(0, 255), rand(0, 255));
        return $randomColor;
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::error('Profile update error: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while updating the profile. Please try again.');
        }
    }


}
