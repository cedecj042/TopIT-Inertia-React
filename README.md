# TopIT 

## Setting up Pusher
1. Create a new Pusher app and take note of the following credentials:
```
BROADCAST_DRIVER=pusher
PUSHER_APP_ID
PUSHER_APP_KEY
PUSHER_APP_SECRET
PUSHER_APP_CLUSTER
```

2. Run composer install and npm install
3. Configure Broadcasting driver

```
'pusher' => [
    'driver' => 'pusher',
    'key' => env('PUSHER_APP_KEY'),
    'secret' => env('PUSHER_APP_SECRET'),
    'app_id' => env('PUSHER_APP_ID'),
    'options' => [
        'cluster'=>env('PUSHER_APP_CLUSTER'),
        'useTLS'=>false, //true for production
        'verify_ssl'=>false, //true for production
        'curl_options' => [
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
        ]
    ],
    'client_options' => [
        // Guzzle client options: https://docs.guzzlephp.org/en/stable/request-options.html
    ],
],
```

# Creating event in laravel 
1. Run command for generating event
```
php artisan make:event YourBroadcastEvent
```

2. Open the event file YourBroadcastEvent.php and modify it to implement broadcasting:

```
class YourBroadcastEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new Channel('your-channel');
    }
    
    public function broadcastAs()
    {
        return 'your-event-name';
    }
}
```


3. Broadcast the Event

```
use App\Events\YourBroadcastEvent;

class YourController extends Controller
{
    public function triggerEvent()
    {
        $message = 'This is a test broadcast';
        broadcast(new YourBroadcastEvent($message));
    }
}
```
