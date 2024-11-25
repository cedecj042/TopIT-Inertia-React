<?php

namespace App\Http\Controllers\Student;

use App\Http\Resources\AssessmentResource;
use App\Models\Test;
use App\Http\Controllers\Controller;
use App\Http\Resources\TestResource;
use App\Models\Assessment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TestController extends Controller
{
    public function index()
    {
        $studentId = Auth::user()->userable->student_id;

        // Get 3 recent test history
        $tests = Assessment::where('student_id', $studentId)
            ->orderBy('updated_at', 'desc')
            ->take(3)
            ->get();

        // Log::info('Tests retrieved:', ['count' => $tests->count(), 'tests' => $tests->toArray()]);

        return Inertia::render('Student/Test', [
            'title' => 'Student Test',
            'tests' => AssessmentResource::collection($tests),
        ]);
    }

    public function testHistory(Request $request)
    {
        $studentId = Auth::user()->userable->student_id;

        $tests = Assessment::where('student_id', $studentId)
            ->orderBy('created_at', 'desc')
            ->paginate(4);

        $testsArray = $tests->toArray();

        return Inertia::render('Student/TestHistory', [
            'tests' => AssessmentResource::collection($tests),  // Apply resource transformation
            'paginationLinks' => $testsArray['links'],
        ]);
    }


}
