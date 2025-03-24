<?php

namespace App\Enums;

enum QuestionType:string{
    case MULTIPLE_CHOICE_MANY = 'Multiple Choice - Many';
    case MULTIPLE_CHOICE_SINGLE = 'Multiple Choice - Single';
    case IDENTIFICATION = 'Identification';
}
