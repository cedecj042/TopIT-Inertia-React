<?php

namespace App\Jobs;

use App\Events\UploadEvent;
use App\Services\FastApiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Course;
use Illuminate\Support\Facades\Log;

class ProcessCourse implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $courseId;

    /**
     * Create a new job instance.
     *
     * @param int $courseId
     */
    public function __construct($courseId)
    {
        $this->courseId = $courseId;
    }

    /**
     * Execute the job.
     */
    public function handle(FastApiService $fastApiService)
    {
        try {
            // Fetch the course by its ID
            $course = Course::find($this->courseId);

            if (!$course) {
                throw new \Exception("Course not found");
            }

            // Prepare the course data in the required format
            $courseData = [
                'course_id' => $course->course_id,
                'title' => $course->title,
                'description' => $course->description,
            ];

            // Send the data to the FastAPI endpoint to create the course
            $result = $fastApiService->sendToFastAPI($courseData,'create_course/');

            if ($result) {
                Log::info('Data was successfully sent to FastAPI.');
                $this->broadcastEvent(null, "Successfully added a new course", null);
            } else {
                Log::warning('Data failed to send to FastAPI.');
                $this->broadcastEvent(null, null, "Failed to save course.");
            }

        } catch (\Exception $e) {
            Log::error('Error processing course: ' . $e->getMessage());
            $this->broadcastEvent(null, null, "Failed to save course.");
        }
    }
    public function broadcastEvent($info = null, $success = null, $error = null)
    {
        Log::info('starting the event');
        broadcast(new UploadEvent($info, $success, $error));
        Log::info('Event broadcasted');
    }
}
