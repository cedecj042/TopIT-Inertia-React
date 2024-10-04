<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Student;
use App\Models\Test;

class Course extends Model
{
    use HasFactory;

    protected $primaryKey= 'course_id';

    protected $fillable = [
        'title',
        'description'
    ];

    public function tests(){
        return $this->belongsTo(Test::class,'course_id');
    }
    public function pdfs(){
        return $this->hasMany(Pdf::class,'course_id','course_id');
    }

    public function modules(){
        return $this->hasMany(Module::class,'course_id','course_id');
    }

    public function questions(){
        return $this->hasMany(Question::class,'course_id','course_id');
    }
    public function pretest_courses(){
        return $this->hasMany(PretestCourse::class,'course_id','course_id');
    }
    public function test_courses(){
        return $this->hasMany(TestCourse::class,'course_id','course_id');
    }
}
