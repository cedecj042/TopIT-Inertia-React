<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TestCourse;
use App\Models\Question;

class TestAnswer extends Model
{
    use HasFactory;

    protected $primaryKey = 'test_answer_id';
    protected $fillable=[
        'test_course_id',
        'question_id',
        'answer',
        'score',
    ];
    public function test_courses(){
        return $this->belongsTo(TestCourse::class,'test_course_id','test_course_id');
    }

    public function questions(){
        return $this->hasMany(Question::class,'test_answer_id','test_answer_id');
    }
}
