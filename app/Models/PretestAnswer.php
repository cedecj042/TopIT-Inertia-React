<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PretestCourse;
use App\Models\PretestQuestion;

class PretestAnswer extends Model
{
    use HasFactory;
    protected $primaryKey= 'pretest_answer_id';
    protected $table = 'pretest_answers';
    protected $fillable = [
        'pretest_course_id',
        'pretest_question_id',
        'participants_answer',
        'score'
    ];
    protected $casts = [
        'participants_answer' => 'array',
    ];


    public function pretest_courses(){
        return $this->belongsTo(PretestCourse::class,'pretest_course_id','pretest_course_id');
    }
    // public function pretest_questions(){
    //     return $this->belongsTo(PretestQuestion::class,'pretest_answer_id','pretest_answer_id');
    // }
    public function pretest_questions(){
        return $this->hasMany(PretestQuestion::class,'pretest_answer_id','pretest_answer_id');
    }

}