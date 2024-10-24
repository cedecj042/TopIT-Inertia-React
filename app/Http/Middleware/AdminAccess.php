<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->userable instanceof Admin) {
                return $next($request);
            } else {
                Auth::logout();
                return redirect()->route('admin.login')->withErrors(['error' => 'You do not have access to this page.']);
            }
        } else {
            return redirect()->route('admin.login');
        }
    }
}
