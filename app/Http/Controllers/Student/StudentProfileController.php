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
use Illuminate\Http\Response;
use Carbon\CarbonPeriod;

class StudentProfileController extends Controller
{
    protected $colors = [
        'rgb(202,62,122)', // Vibrant Blue
        'rgb(0,166,231)',  // Vibrant Red
        'rgb(74,193,192)', // Vibrant Green
        'rgb(254,206,109)', // Vibrant Yellow
        'rgb(55,69,127)', // Vibrant Violet
        'rgb(254,120,89)', // Vibrant Pink
    ];
    public function getColor($index)
    {
        return $this->colors[$index % count($this->colors)];
    }
    public function showStudentDetails(Request $request)
    {
        $student = Auth::user()->userable;

        $startDate = $request->input('from', now()->startOfWeek()->format('Y-m-d'));
        $endDate = $request->input('to', now()->endOfWeek()->format('Y-m-d'));

        $progressData = $this->getCourseProgressData($student->student_id, $startDate, $endDate);

        return Inertia::render('Student/Profile', [
            'title' => 'Student Profile',
            'student' => new StudentResource($student),
            'progressData' => $progressData,
            'from' => $startDate,
            'to' => $endDate
        ]);
    }

    public function getCourseProgressData($studentId, $from = null, $to = null)
    {

        try {
            $startDate = Carbon::parse($from);
            $endDate = Carbon::parse($to);
        } catch (\Exception $e) {
            $startDate = now()->startOfWeek();
            $endDate = now()->endOfWeek();
        }

        // \Log::info('Received from:', ['from' => $startDate]);
        // \Log::info('Received to:', ['to' => $endDate]);

        $thetaScores = AssessmentCourse::whereHas('assessment', function ($query) use ($studentId) {
            $query->where('student_id', $studentId);
        })
            ->select('course_id', 'final_theta_score', 'created_at')
            ->with('course')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'asc')
            ->get();

        $currentDate = now()->format('Y-m-d');
        $dateRange = [];

        $rangeStart = clone $startDate;
        while ($rangeStart <= $endDate) {
            $dateRange[] = $rangeStart->format('Y-m-d');
            $rangeStart->addDay();
        }

        $progressData = [
            'labels' => $dateRange,
            'datasets' => [],
            'from' => $startDate->format('Y-m-d'),
            'to' => $endDate->format('Y-m-d')
        ];

        $thetaScores = $thetaScores->map(function ($item) {
            $item->date = $item->created_at->format('Y-m-d');
            return $item;
        });

        $groupedScores = $thetaScores->groupBy('course.title');
        $i=0;
        foreach ($groupedScores as $courseTitle => $scores) {
            $data = [];
            $lastValidScore = null;

            foreach ($dateRange as $date) {
                if ($date > $currentDate) {
                    $data[] = null;
                    continue;
                }

                $dailyScores = $scores->where('date', $date);

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
                'borderColor' => $this->getColor($i),
                'backgroundColor' => str_replace('1)', '0.2)', $this->getColor($i)),
                'tension' => 0.3,
                'showLine' => true,
            ];
            $i++;
        }

        return $progressData;
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
