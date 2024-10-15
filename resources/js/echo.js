import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'ff515177a6f3c072d325',  // <-- This is the Pusher app key
    cluster: 'ap1',  // <-- This is the Pusher app cluster
    forceTLS: true,  // Ensure that you are using a secure connection
});

export default echo;