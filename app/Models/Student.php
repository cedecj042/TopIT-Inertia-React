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
        'created_at',
        'updated_at'
    ];

    public function user(){
        return $this->morphOne(User::class,'userable');
    }
    public function pretests(){
        return $this->hasOne(Pretest::class,'student_id','student_id');
    }
    public function tests(){
        return $this->hasMany(Test::class,'student_id','student_id');
    }
}
