<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionRecalibrationLog extends Model
{
    use HasFactory;
    protected $primaryKey = 'log_id';

    protected $table = 'question_recalibration_logs';

    protected $fillable = [
        'question_id',
        'previous_difficulty_type',
        'new_difficulty_type',
        'previous_difficulty_value',
        'new_difficulty_value',
        'previous_discrimination_index',
        'new_discrimination_index',
        'updated_at',
        'created_at'
    ];

    public function question(){
        return $this->belongsTo( Question::class,'question_id', 'question_id');
    }
}
