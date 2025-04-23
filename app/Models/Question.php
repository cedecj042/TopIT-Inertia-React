<?php

namespace App\Models;

use App\Enums\QuestionDifficulty;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Course;
use Illuminate\Support\Collection;

class Question extends Model
{
    use HasFactory;
    protected $primaryKey = 'question_id';
    protected $fillable = [
        'course_id',
        'question_job_id',
        'question_uid',
        'module_uid',
        'difficulty_type',
        'difficulty_value',
        'discrimination_index',
        'question',
        'question_type',
        'answer',
        'choices',
        'created_at',
        'updated_at'
    ];
    public function question_job()
    {
        return $this->belongsTo(QuestionJob::class, 'generate_question_id', 'generate_question_id');
    }
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
    public function assessment_items()
    {
        return $this->hasMany(AssessmentItem::class, 'question_id', 'question_id');
    }
    public function question_recalibration_logs()
    {
        return $this->hasMany(QuestionRecalibrationLog::class, 'question_id', 'question_id');
    }

    public static function selectForAssessment(Course $course, int $total): Collection
    {
        $difficultyLevels = QuestionDifficulty::cases();
        $difficultyCount = count($difficultyLevels);
        $perDifficulty = (int) floor($total / $difficultyCount);
        $remainder = $total % $difficultyCount;

        $selected = collect();

        foreach ($difficultyLevels as $i => $difficulty) {
            $limit = $perDifficulty + ($i < $remainder ? 1 : 0);

            $filtered = $course->questions
                ->where('difficulty_type', $difficulty->value)
                ->shuffle()
                ->take($limit);

            $selected = $selected->merge($filtered);
        }

        return $selected;
    }


}
