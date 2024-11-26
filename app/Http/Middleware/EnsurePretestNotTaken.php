<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Assessment;

class EnsurePretestNotTaken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $student = Auth::user()->userable;

        $existingPretest = Assessment::where('student_id', $student->student_id)
            ->where('type', 'Pretest')
            ->where('status', 'Completed')
            ->exists();

        if ($existingPretest) {
            return redirect()->route('dashboard')->with('error', 'You have already completed the pretest.');
        }

        return $next($request);
    }
}
