<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use App\Models\Student;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->userable instanceof Admin) {
                return redirect('/admin/dashboard');
            } elseif ($user->userable instanceof Student) {
                return redirect('/dashboard');
            }
        }
        return $next($request);
    }
}
