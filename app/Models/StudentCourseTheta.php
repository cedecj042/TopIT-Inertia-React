<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentCourseTheta extends Model
{
    use HasFactory;

    protected $primaryKey = 'student_course_theta_id';

    protected $table = 'student_course_thetas';
    protected $fillable = [
        'student_id',
        'course_id',
        'theta_score',
        'created_at',
        'updated_at'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }

    public function scopeGetCurrentTheta($query, $student_id, $course_id)
{
    return $query->where('student_id', $student_id)
                 ->where('course_id', $course_id);
}
    public function scopeByCourse($query, int $courseId)
    {
        return $query->where('course_id', $courseId);
    }

    public function scopeByStudentAndCourse($query, int $studentId, int $courseId)
    {
        return $query->where('student_id', $studentId)->where('course_id', $courseId);
    }

}
