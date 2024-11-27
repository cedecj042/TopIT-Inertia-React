<?php

namespace App\Observers;

use App\Models\Course;
use App\Services\ThetaService;
use Log;

class CourseObserver
{
    protected $thetaService;

    public function __construct(ThetaService $thetaService)
    {
        $this->thetaService = $thetaService;
    }

    public function created(Course $course)
    {
        $this->thetaService->initializeThetaForCourse($course);
    }

    public function deleted(Course $course)
    {
        $this->thetaService->cleanupThetaForDeletedCourse($course);

        Log::info('Course deleted and related records cleaned up', [
            'course_id' => $course->course_id,
        ]);
    }
}
