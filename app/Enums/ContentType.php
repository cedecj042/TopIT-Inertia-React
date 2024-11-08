<?php

namespace App\Enums;

enum ContentType:string{
    case TABLE = 'Tables';
    case FIGURE = 'Figures';
    case CODE = 'Code';
    case TEXT = 'Text';
    case HEADER = 'Header';
}