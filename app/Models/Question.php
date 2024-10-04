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
    protected $primaryKey='question_id';
    protected $fillable = ['course_id', 'questionable_id', 'questionable_type', 'difficulty_id', 'question', 'discrimination_index'];

    public function questionable()
    {
        return $this->morphTo();
    }
    public function courses(){
       return $this->belongsTo(Course::class,'course_id','course_id');    
    }
    public function tests(){
        return $this->belongsToMany(Test::class,'test_questions','question_id','test_id');
    }

    public function difficulty()
    {
        return $this->belongsTo(Difficulty::class, 'difficulty_id', 'difficulty_id');
    }

    public function pretest_questions(){
        return $this->hasMany(PretestQuestion::class,'question_id','question_id');
    }
    public function test_answers(){
        return $this->hasMany(TestAnswer::class,'question_id','question_id');
    }
}
