<?php

namespace App\Enums;

enum PdfStatus: string
{
    case SUCCESS = 'Success';
    case FAILED = 'Failed';
    case UPLOADING = 'Uploading';
    case PROCESSING = 'Processing';
}
