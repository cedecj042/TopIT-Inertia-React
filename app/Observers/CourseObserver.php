<?php

namespace App\Observers;

use App\Jobs\ProcessCourse;
use App\Models\Course;
use App\Services\FastApiService;
use App\Services\ThetaService;
use Illuminate\Support\Facades\Log as FacadesLog;
use Log;

class CourseObserver
{
    protected $thetaService;
    protected $fastAPIService;

    public function __construct(ThetaService $thetaService,FastApiService $fastAPIService)
    {
        $this->thetaService = $thetaService;
        $this->fastAPIService = $fastAPIService;
    }

    public function created(Course $course)
    {
        $this->thetaService->initializeThetaForCourse($course);
        // Dispatch job to process the course
        ProcessCourse::dispatch($course);

        Log::info('Course created and job dispatched', [
            'course_id' => $course->course_id,
        ]);
    }

    public function deleted(Course $course)
    {
        $this->thetaService->cleanupThetaForDeletedCourse($course);
        FacadesLog::info('Course deleted and related records cleaned up', [
            'course_id' => $course->course_id,
        ]);

        $response = $this->fastAPIService->deleteCourse($course->course_id);
        if ($response->successful()) {
            Log::info('FastAPI delete response: ' . $response->body());
        } else {
            Log::error('FastAPI delete request failed: ' . $response->body());
        }
    }

    public function deleting(Course $course){
        foreach ($course->modules as $module) {
            $module->delete();
        }
    }
}
