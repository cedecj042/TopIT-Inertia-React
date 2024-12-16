<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Assessment;

class CheckPretestCompletion
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $student = Auth::user()->userable;

        $hasCompletedPretest = Assessment::where('student_id', $student->student_id)
            ->where('type', 'Pretest')
            ->where('status', 'Completed')
            ->exists();

        if (!$hasCompletedPretest) {
            return redirect()->route('welcome')->with('error', 'You must complete the pretest before proceeding.');
        }

        return $next($request);
    }
}
