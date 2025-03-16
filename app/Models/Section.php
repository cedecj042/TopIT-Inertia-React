<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Lesson;
use App\Models\Subsection;
use App\Models\Table;
use App\Models\Question;
use App\Models\Code;
use App\Models\Figure;


class Section extends Model
{
    use HasFactory;

    protected $primaryKey = 'section_id';

    protected $fillable = [
        'section_uid',
        'lesson_id',
        'title',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($section) {
            if (!$section->section_uid) {
                $section->section_uid = 'SC' . ((Section::max('section_id') ?? 0) + 1);
            }
        });
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class, 'lesson_id', 'lesson_id');
    }
    public function subsections()
    {
        return $this->hasMany(Subsection::class, 'section_id');
    }
    public function contents()
    {
        return $this->morphMany(Content::class, 'contentable');
    }
    public function module()
    {
        return $this->lesson->module();
    }

}
