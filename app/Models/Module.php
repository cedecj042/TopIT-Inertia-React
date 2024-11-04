<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Lesson;

class Module extends Model
{
    use HasFactory;
    protected $primaryKey='module_id';
    protected $fillable = [
        'course_id',
        'title',
    ];

    
    public function lessons(){
        return $this->hasMany(Lesson::class,'module_id');
    }
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
    public function attachments(){
        return $this->morphMany(Attachment::class,'attachmentable');
    }
}
