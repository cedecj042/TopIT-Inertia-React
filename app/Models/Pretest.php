<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Student;
use App\Models\PretestCourse;

class Pretest extends Model
{
    use HasFactory;

    protected $primaryKey = 'pretest_id';

    protected $table = 'pretests';

    protected $fillable=[
        'student_id',
        'totalItems',
        'totalScore',
        'percentage',
        'status'
    ];
    public function students(){
        return $this->belongsTo(Student::class,'student_id','student_id');
    }
    public function pretest_courses(){
        return $this->hasMany(PretestCourse::class,'pretest_id','pretest_id');
    }
}
