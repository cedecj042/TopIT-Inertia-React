<?php

use App\Http\Middleware\RedirectIfAuthenticated;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\ShareInertiaFlashMessages::class,
        ]);
        $middleware->alias([
            'auth' => Authenticate::class,
            'student' => \App\Http\Middleware\StudentAccess::class,
            'admin' => \App\Http\Middleware\AdminAccess::class,
            'guest' => RedirectIfAuthenticated::class,
            'pretest.not_taken' => \App\Http\Middleware\EnsurePretestNotTaken::class,
            'pretest.completed' =>\App\Http\Middleware\CheckPretestCompletion::class,
        ]);
        $middleware->validateCsrfTokens(except:[
            '/admin/store-processed-pdf',
            '/admin/store-questions',
            '/admin/update-module-status',
        ]);
        

        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
