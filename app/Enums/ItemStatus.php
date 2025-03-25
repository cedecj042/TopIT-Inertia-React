<?php

namespace App\Enums;


enum ItemStatus:string
{
    case IN_PROGRESS = 'In Progress';
    case COMPLETED = 'Completed';
}