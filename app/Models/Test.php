<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Student;

class Test extends Model
{
    use HasFactory;
    protected $primaryKey = 'test_id';

    protected $table = 'tests';
    
    protected $fillable = [
      'student_id',
      'start_time',
      'end_time',
      'totalItems',
      'totalScore',
      'percentage',
      'status'  
    ];
    public function students(){
        return $this->belongsTo(Student::class,'student_id','student_id');
    }

    public function test_courses(){
        return $this->hasMany(TestCourse::class,'test_id','test_id');
    }
}