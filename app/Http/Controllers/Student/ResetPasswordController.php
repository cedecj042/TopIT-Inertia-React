<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Helpers\CMail;


class ResetPasswordController extends Controller
{
    public function passwordEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return back()->withErrors(['email' => 'No user found with this email address.']);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => $token,
                'created_at' => Carbon::now()
            ]
        );

        $actionLink = route('password.reset', ['token' => $token]);
        $data = ['actionLink' => $actionLink, 'user' => $user];

        $mail_body = view('email-templates.forgot-template', $data)->render();
        $mailConfig = [
            'recipient_address' => $user->email,
            'recipient_name' => $user->username,
            'subject' => 'Reset Password',
            'body' => $mail_body
        ];

        if (CMail::send($mailConfig)) {
            return back()->with('success', 'We have emailed your password reset link.');
        } else {
            return back()->withErrors(['email' => 'Failed to send the email. Please try again later.']);
        }
    }

    public function passwordReset(string $token)
    {
        return Inertia::render('Auth/ResetPassword', ['token' => $token]);
    }

    public function passwordUpdate(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return back()->withErrors(['email' => 'Invalid email address.']);
        }

        $tokenData = DB::table('password_reset_tokens')
            ->where('email', $user->email)
            ->where('token', $request->token)
            ->first();

        if (!$tokenData) {
            return back()->withErrors(['token' => 'Invalid or expired token.']);
        }

        $user->forceFill([
            'password' => Hash::make($request->password),
        ])->setRememberToken(Str::random(60));
        $user->save();

        DB::table('password_reset_tokens')->where('email', $user->email)->delete();

        return redirect()->route('login')->with('status', 'Password has been successfully reset.');
    }

    public function showForgotPasswordForm()
    {
        return Inertia::render('Auth/ForgotPassword');
    }
}


