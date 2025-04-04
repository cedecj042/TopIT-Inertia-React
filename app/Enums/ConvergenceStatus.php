<?php

namespace App\Enums;

enum ConvergenceStatus: string
{
    case ALL = 'All';
    case SOME = 'Some';
    case NONE = 'None';
}
