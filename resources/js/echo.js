import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,    // Correct usage for environment variables in Vite
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: false,
});

export default echo;