<?php

namespace App\Models;

use App\Enums\AssessmentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentCourse extends Model
{
    use HasFactory;
    protected $primaryKey = 'assessment_course_id';

    protected $table = 'assessment_courses';
    protected $fillable = [
        'assessment_id',
        'course_id',
        'total_items',
        'total_score',
        'percentage',
        'initial_theta_score',
        'final_theta_score',
        'created_at',
        'updated_at'
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class, 'assessment_id', 'assessment_id');
    }

    public function assessment_items()
    {
        return $this->hasMany(AssessmentItem::class, 'assessment_course_id', 'assessment_course_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
    public function theta_score_logs()
    {
        return $this->hasMany(ThetaScoreLog::class, 'assessment_course_id', 'assessment_course_id');
    }

    public function scopeGetFinalThetaScoresForCourse($query, $course_id, $student_id)
    {
        return $query->where('course_id', $course_id)
            ->whereHas('assessment', function ($q) use ($student_id) {
                $q->where('student_id', $student_id)->where('status', AssessmentStatus::COMPLETED->value);
            })
            ->pluck('final_theta_score');
    }
}
