<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Pretest;
use App\Models\Test;


class Student extends Model
{
    use HasFactory;
    protected $primaryKey = 'student_id';
    protected $attributes = [
        'pretest_completed' => false,
    ];
    
    protected $fillable = [
        'firstname',
        'lastname',
        'profile_image',
        'birthdate',
        'gender',
        'age',
        'address',
        'course',
        'school',
        'year',
        'pretest_completed',
        'created_at',
        'updated_at'
    ];

    public function user(){
        return $this->morphOne(User::class,'userable');
    }
    public function tests(){
        return $this->hasMany(Assessment::class,'student_id','student_id');
    }
    public function student_course_thetas(){
        return $this->hasMany(StudentCourseTheta::class,'student_id','student_id');
    }
}
