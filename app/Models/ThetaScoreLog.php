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
      'student_course_theta_id',
      'previous_theta_score',
      'new_theta_score',
    ];
    public function student_course_theta(){
        return $this->belongsTo(StudentCourseTheta::class,'student_course_theta_id','student_course_theta_id');
    }

    public function assessment_items(){
        return $this->hasMany(AssessmentItem::class,'assessment_id','assessment_id');
    }
}
