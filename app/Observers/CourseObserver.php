<?php

namespace App\Observers;

use App\Jobs\ProcessCourse;
use App\Models\Course;
use App\Services\ThetaService;
use Illuminate\Support\Facades\Log as FacadesLog;
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
        ProcessCourse::dispatch($course->course_id);

    }

    public function deleted(Course $course)
    {
        $this->thetaService->cleanupThetaForDeletedCourse($course);

        FacadesLog::info('Course deleted and related records cleaned up', [
            'course_id' => $course->course_id,
        ]);
    }
}
