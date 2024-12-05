<?php

namespace App\Enums;

enum QuestionDifficulty:string{
    case VERY_EASY = 'Very Easy';
    case EASY = 'Easy';
    case AVERAGE = 'Average';
    case HARD = 'Hard';
    case VERY_HARD = 'Very Hard';
}
