<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Module;
use App\Models\Section;
use Log;

class Lesson extends Model
{
    use HasFactory;

    protected $primaryKey= 'lesson_id';
    protected $fillable = [
        'lesson_uid',
        'module_id',
        'title',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($lesson) {
            if (!$lesson->lesson_uid) {
                $lesson->lesson_uid = 'LS' . ((Lesson::max('lesson_id') ?? 0) + 1);
            }
        });
    }


    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id', 'module_id');
    }

    public function sections()
    {
        return $this->hasMany(Section::class, 'lesson_id');
    }
    public function contents()
    {
        return $this->morphMany(Content::class, 'contentable');
    }

}
