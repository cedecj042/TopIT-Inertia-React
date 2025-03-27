<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Course;

class Question extends Model
{
    use HasFactory;
    protected $primaryKey = 'question_id';
    protected $fillable = [
        'course_id',
        'question_uid',
        'difficulty_id',
        'test_type',
        'question',
        'difficulty_type',
        'difficulty_value',
        'discrimination_index',
        'question_type',
        'answer',
        'choices',
        'created_at',
        'updated_at'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
    public function assessment_items()
    {
        return $this->hasMany(AssessmentItem::class, 'question_id', 'question_id');
    }
    public function question_recalibration_logs(){
        return $this->hasMany(QuestionRecalibrationLog::class,'question_id','question_id');
    }
    
}
