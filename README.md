# TopIT 

# Project Setup

1. Download WSL (For Windows Devices)
2. Download Ubuntu (For windows devices)
3. Download Docker Desktop
4. Open docker desktop and in your settings, configure wsl integration under resources tab, 
```
Enable integration with my default WSL distro
```
5. Inside your Ubuntu terminal, clone this repository
6. CD into the cloned repository
7. Run this command to install composer dependences 
```
docker run --rm \
   -u "$(id -u):$(id -g)" \
   -v "$(pwd):/var/www/html" \
   -w /var/www/html \
   laravelsail/php84-composer:latest \
   composer install --ignore-platform-reqs
```
8. In your Ubuntu terminal (outside your repository and the directory when opening the ubuntu terminal), open the file ~/.bashrc and add the following at the bottom of the file
```
alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'
```
and save it.
9. Go back to the repository directory and copy the .env.example for your .env
```
cp .env.example .env
```
10. Generate a new app key for laravel
```
sail artisan key:generate
```
11. Install the node dependencies
```
sail npm install
```
12. Go back to the repository directory and run `sail up -d`
13. Before running the app, make sure you had run `sail artisan migrate` and `sail artisan db:seed` if you dont want the existing database. 
Else, run the script for importing existing database backup with modules and questions
```
./import_sql.sh
```
14. Once finished, run all `sail npm run dev`, `sail artisan serve`, and `sail artisan queue:work`


## Take Note of this commands
1. This stops and removes all Sail-related Docker containers without including the volumes.
```
sail down
```
2. This stops and removes all Sail-related Docker containers including the volumes(which contains your database).
```
sail down --volumes
```
3. This starts Laravel Sail in the background (detached mode). Runs mysql, and laravel app.
```
sail up -d
```



## Setting up Pusher (No need to run)
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
or if using Docker
```
sail artisan make:event NameOfBroadcastEvent
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
