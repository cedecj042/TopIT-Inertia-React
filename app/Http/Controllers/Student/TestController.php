<?php

namespace App\Http\Controllers\Student;

use App\Models\Test;
use App\Http\Controllers\Controller;
use App\Http\Resources\TestResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class TestController extends Controller
{
    public function index()
    {
        $student_id = Auth::user()->userable->student_id;

        $tests = Test::where('student_id', $student_id)->get();
        \Log::info('Tests retrieved:', ['count' => $tests->count(), 'tests' => $tests->toArray()]);

        return Inertia::render('Student/Test', [
            'title' => 'Test History',
            'tests' => TestResource::collection($tests),
        ]);
    }
}
