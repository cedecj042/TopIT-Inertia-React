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
        $student_id = Auth::user()->userable->student_id;

        $tests = Assessment::where('student_id', $student_id)->get();
        Log::info('Tests retrieved:', ['count' => $tests->count(), 'tests' => $tests->toArray()]);

        return Inertia::render('Student/Test', [
            'title' => 'Student Test',
            'tests' => AssessmentResource::collection($tests),
        ]);
    }
}
