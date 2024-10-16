<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UploadEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    public $info;
    public $success;
    public $error;

    public function __construct($info = null, $success = null, $error = null)
    {
        $this->info = $info;
        $this->success = $success;
        $this->error = $error;
    }
    
    public function broadcastOn()
    {
        return [new PrivateChannel('admin-channel')];
    }
    public function broadcastAs()
    {
        return 'upload';
    }
    public function broadcastWith()
    {
        return [
            'info' => $this->info,
            'success' => $this->success,
            'error' => $this->error,
        ];
    }
}
