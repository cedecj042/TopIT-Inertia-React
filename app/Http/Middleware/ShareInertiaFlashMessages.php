<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Session;
use Inertia\Middleware;

class ShareInertiaFlashMessages extends Middleware
{
    public function share($request)
    {
        return array_merge(parent::share($request), [
            'flash' => function () {
                return [
                    'success' => Session::get('success'),
                    'error' => Session::get('error'),
                ];
            },
        ]);
    }
}
