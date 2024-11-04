<?php

namespace App\Enums;

enum AssessmentStatus: string
{
    case NOT_STARTED = 'Not Started';
    case IN_PROGRESS = 'In Progress';
    case COMPLETED = 'Completed';
}
