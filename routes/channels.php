<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Authorize users to listen to the 'admin' private channel
Broadcast::channel('admin', function ($user) {
    return $user && $user->isAdmin(); 
});


Broadcast::channel('student-channel', function ($user) {
    return $user && $user->isStudent(); 
});
