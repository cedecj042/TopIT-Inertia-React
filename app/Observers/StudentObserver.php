<?php

namespace App\Observers;

use App\Models\Student;
use App\Services\ThetaService;

class StudentObserver
{
    protected $thetaService;

    public function __construct(ThetaService $thetaService)
    {
        $this->thetaService = $thetaService;
    }

    public function created(Student $student)
    {
        $this->thetaService->initializeThetaForStudent($student);
    }
}
