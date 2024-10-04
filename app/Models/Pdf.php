<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Course;
class Pdf extends Model
{
    use HasFactory;

    protected $primaryKey='pdf_id';
    protected $fillable = [
        'course_id',
        'file_name',
        'file_path',
        'status',
        'uploaded_by',
    ];

    public function courses(){
        return $this->belongsTo(Course::class,'course_id');
    }
}
