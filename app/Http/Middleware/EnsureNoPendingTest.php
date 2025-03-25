<?php

namespace App\Http\Middleware;

use App\Enums\AssessmentStatus;
use App\Enums\AssessmentType;
use App\Models\Assessment;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureNoPendingTest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $student = Auth::user()->userable;

        $pendingTest = Assessment::where('student_id', $student->student_id)
            ->where('type', AssessmentType::TEST->value)
            ->where('status', AssessmentStatus::IN_PROGRESS->value)
            ->first();

        if ($pendingTest) {
            return redirect()->route('test.show', ['assessment' => $pendingTest->assessment_id]);
        }
        return $next($request);

    }
}
