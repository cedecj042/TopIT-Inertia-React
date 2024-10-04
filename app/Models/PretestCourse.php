<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Course;
use App\Models\Pretest;

class PretestCourse extends Model
{
    use HasFactory;

    protected $primaryKey = 'pretest_course_id';
    protected $table = 'pretest_courses';

    protected $fillable =[
        'course_id',
        'pretest_id',
        'theta_score'
    ];
    

    public function courses(){
        return $this->belongsTo(Course::class,'course_id','course_id');
    }
    public function pretests(){
        return $this->belongsTo(Pretest::class,'pretest_id','pretest_id');
    }

}
