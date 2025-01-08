<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PdfProgressEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $progress;
    public $courseId;
    public $fileName;

    /**
     * Create a new event instance.
     *
     * @param int $progress The current progress percentage.
     * @param int $courseId The ID of the course associated with the PDF.
     * @param string $fileName The name of the file being processed.
     */
    public function __construct($courseId, $fileName, $progress)
    {
        $this->courseId = $courseId;
        $this->fileName = $fileName;
        $this->progress = $progress;
    }


    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return [new PrivateChannel('admin')];
    }
    public function broadcastAs()
    {
        return 'progress';
    }
    public function broadcastWith()
    {
        return [
            'courseId' => $this->courseId,
            'fileName' => $this->fileName,
            'progress' => $this->progress
        ];
    }
}
