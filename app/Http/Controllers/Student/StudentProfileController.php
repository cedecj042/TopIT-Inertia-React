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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

class StudentProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function showStudentDetails()
    {
        $studentId = Student::find(Auth::user()->userable->student_id);

        return Inertia::render('Student/Profile', [
            'title' => 'Student Profile',
            'student' => new StudentResource($studentId),
        ]);
    }

    public function editProfile(Request $request)
    {
        try {
            $student = Auth::user()->userable;

            $validatedData = $request->validate([
                'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'birthdate' => 'nullable|date',
                'gender' => ['required', Rule::in(['Male', 'Female', 'Others'])],
                'address' => 'nullable|string|max:500',
                'school' => 'nullable|string|max:255',
                'year' => 'nullable|string|max:50',
            ]);

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
