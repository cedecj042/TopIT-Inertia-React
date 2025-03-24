<?php

namespace App\Models;

use App\Enums\ItemStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentItem extends Model
{
    use HasFactory;
    protected $primaryKey = 'assessment_item_id';
    protected $attributes = [
        'status' => ItemStatus::IN_PROGRESS->value,
    ];
    protected $table = 'assessment_items';
    protected $fillable = [
        'assessment_course_id',
        'question_id',
        'participants_answer',
        'score',
        'status',
        'created_at',
        'updated_at'
    ];

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id', 'question_id');
    }
    public function assessment_course()
    {
        return $this->belongsTo(AssessmentCourse::class, 'assessment_course_id', 'assessment_course_id');
    }
    public function theta_score_log()
    {
        return $this->hasOne(ThetaScoreLog::class, 'assessment_item_id', 'assessment_item_id');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
    // public function scopeGetCurrentItem($query, $assessment)
    // {
    //     return 
    // }

}
