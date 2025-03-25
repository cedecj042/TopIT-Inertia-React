<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Assessment;

class CheckPretestCompletion
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
        $completed = Auth::user()->userable->pretest_completed;

        if (!$completed) {
            return redirect()->route('welcome')->with('message', 'You have not completed the pretest yet.');
        }

        return $next($request);
    }
}
