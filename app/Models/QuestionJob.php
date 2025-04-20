<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionJob extends Model
{
    use HasFactory;

    protected $table = 'question_jobs';
    protected $primaryKey = 'question_job_id';
    protected $fillable = [
        'course_id',
        'total_very_easy',
        'total_easy',
        'total_average',
        'total_hard',
        'total_very_hard',
        'total_questions',
        'status',
        'generated_by',
        'created_at',
        'updated_at'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
    public function questions()
    {
        return $this->hasMany(Question::class, 'generate_question_id', 'generate_question_id');
    }

    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

}
