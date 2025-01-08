<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Lesson;

class Module extends Model
{
    use HasFactory;
    protected $primaryKey = 'module_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($module) {
            $course_id = $module->course_id;
            $lastModule = Module::where('course_id', $course_id)->orderBy('module_id', 'desc')->first();
            $module->module_id = $lastModule ? $lastModule->module_id + 1 : $course_id . '001';  // String manipulation for ID
        });
    }

    protected $fillable = [
        'course_id',
        'title',
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
