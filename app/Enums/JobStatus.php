<?php

namespace App\Enums;

enum JobStatus: string
{
    case SUCCESS = 'Success';
    case FAILED = 'Failed';
    case PENDING = 'Pending';
    case PROCESSING = 'Processing';
}
