import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
Pusher.logToConsole = true;

let echo = null;

function initializeEcho() {
    if (!echo) {
        echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: false,
            authEndpoint: "/broadcasting/auth",
        });
    }
    return echo;
}

function disconnectEcho() {
    if (echo) {
        echo.disconnect();
        echo = null;
    }
}

export { initializeEcho, disconnectEcho };
