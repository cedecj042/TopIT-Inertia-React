<?php

namespace App\Enums;


enum ItemStatus:string
{
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
}