<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThetaScoreLog extends Model
{
    use HasFactory;
    protected $primaryKey = 'theta_score_log_id';

    protected $table = 'theta_score_logs';

    protected $fillable = [
        'assessment_item_id',
        'assessment_course_id',
        'previous_theta_score',
        'new_theta_score',
    ];
    public function assessment_course()
    {
        return $this->belongsTo(AssessmentCourse::class, 'assessment_course_id', 'assessment_course_id');
    }

    public function assessment_item()
    {
        return $this->belongsTo(AssessmentItem::class, 'assessment_item_id', 'assessment_item_id');
    }
}
