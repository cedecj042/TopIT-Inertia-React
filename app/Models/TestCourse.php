<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Test;
use App\Models\Course;
use App\Models\TestAnswer;


class TestCourse extends Model
{
    use HasFactory;

    protected $primaryKey='test_course_id';
    protected $fillable=[
        'test_id',
        'course_id',
        'theta_score'
    ];
    protected $table = 'test_courses';
    public function tests(){
        return $this->belongsTo(Test::class,'test_id','test_id');
    }

    public function courses(){
        return $this->belongsTo(Course::class,'course_id','course_id');
    }

    public function test_answers(){
        return $this->hasMany(TestAnswer::class,'test_course_id','test_course_id');
    }

}

