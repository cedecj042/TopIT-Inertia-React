<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Course;
use App\Models\Test;
use App\Models\Difficulty;
use App\Models\PretestQuestion;
use App\Models\TestAnswer;

class Question extends Model
{
    use HasFactory;
    protected $primaryKey = 'question_id';
    protected $fillable = [
        'course_id',
        'question_detail_id',
        'difficulty_id',
        'test_type',
        'question',
        'discrimination_index',
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
    
    public function difficulty()
    {
        return $this->belongsTo(Difficulty::class, 'difficulty_id', 'difficulty_id');
    }

    public function question_detail()
    {
        return $this->belongsTo(QuestionDetail::class, 'question_detail_id', 'question_detail_id');
    }
    
}
