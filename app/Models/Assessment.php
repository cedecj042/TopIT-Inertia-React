<?php

namespace App\Models;

use App\Enums\AssessmentType;
use App\Enums\ItemStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Student;

class Assessment extends Model
{
    use HasFactory;
    protected $primaryKey = 'assessment_id';

    protected $table = 'assessments';

    protected $fillable = [
        'student_id',
        'type',
        'start_time',
        'end_time',
        'total_items',
        'total_score',
        'percentage',
        'status',
        'created_at',
        'updated_at'
    ];
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function assessment_courses()
    {
        return $this->hasMany(AssessmentCourse::class, 'assessment_id', 'assessment_id');
    }

    public function scopeIsPretest($query)
    {
        return $query->where('type', AssessmentType::PRETEST);
    }

    public function scoeIsTest($query)
    {
        return $query->where('type', AssessmentType::TEST);
    }
    public function inProgressItems()
    {
        return $this->hasManyThrough(AssessmentItem::class, AssessmentCourse::class, 'assessment_id', 'assessment_course_id')
            ->where('assessment_items.status', ItemStatus::IN_PROGRESS->value)
            ->latest('assessment_items.updated_at');
    }
}