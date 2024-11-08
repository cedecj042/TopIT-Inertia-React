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
        'lesson_id',
        'title',
    ];
    public function lesson(){
        return $this->belongsTo(Lesson::class,'lesson_id','lesson_id');
    }
    public function subsections(){
        return $this->hasMany(Subsection::class,'section_id');
    }
    public function contents()
    {
        return $this->morphMany(Content::class, 'contentable');
    }
    
    
}
