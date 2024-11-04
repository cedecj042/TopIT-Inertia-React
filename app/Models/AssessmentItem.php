<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentItem extends Model
{
    use HasFactory;
    protected $primaryKey = 'assessment_item_id';

    protected $table = 'assessment_items';
    protected $fillable = [
        'assessment_course_id',
        'question_id',
        'participants_answer',
        'score',
        'created_at',
        'updated_at'
    ];

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id', 'question_id');
    }
    public function assessment_course(){
        return $this->belongsTo(AssessmentCourse::class,'assessment_course_id','assessment_course_id');
    }
}
