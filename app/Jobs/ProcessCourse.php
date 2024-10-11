<?php

namespace App\Jobs;

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
            $fastApiService->sendToFastAPI($courseData,'create_course/');

            Log::info('Course processed successfully: ', ['course_id' => $course->course_id]);

        } catch (\Exception $e) {
            Log::error('Error processing course: ' . $e->getMessage());
        }
    }
}
