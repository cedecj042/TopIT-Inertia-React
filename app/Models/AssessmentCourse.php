<?php

namespace App\Models;

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
      'created_at',
      'updated_at',
      'percentage',
      'initial_theta_score',
      'final_theta_score'
    ];
    public function assessment(){
        return $this->belongsTo(Assessment::class,'assessment_id','assessment_id');
    }

    public function assessment_items(){
        return $this->hasMany(AssessmentItem::class,'assessment_course_id','assessment_course_id');
    }

    public function course(){
        return $this->belongsTo(Course::class,'course_id','course_id');
    }
}
