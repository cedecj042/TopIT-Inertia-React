<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Lesson;
use Log;

class Module extends Model
{
    use HasFactory;

    protected $primaryKey = 'module_id';
    protected $fillable = [
        'module_uid',
        'course_id',
        'title',
        'vectorized'
    ];

    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'module_id');
    }
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
    public function contents()
    {
        return $this->morphMany(Content::class, 'contentable');
    }

}
