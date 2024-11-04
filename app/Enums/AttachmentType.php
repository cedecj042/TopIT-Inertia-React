<?php

namespace App\Enums;

enum AttachmentType:string{
    case TABLE = 'Tables';
    case FIGURE = 'Figures';
    case CODE = 'Code';
    case TEXT = 'Text';
    case HEADER = 'Header';
}