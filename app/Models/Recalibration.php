<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recalibration extends Model
{
    use HasFactory;

    protected $primaryKey = 'recalibration_id';
    protected $table= 'recalibrations';

    protected $fillable = [
        'status',
        'total_question_logs',
        'recalibrated_by',
        'total_iterations',
        'convergence_status',
        'created_at',
        'updated_at'
    ];

    public function question_recalibrations(){
        return $this->hasMany(QuestionRecalibrationLog::class,'recalibration_id');
    }
}
