<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Section;
use App\Models\Table;
use App\Models\Question;
use App\Models\Code;
use App\Models\Figure;

class Subsection extends Model
{
    use HasFactory;
    protected $primaryKey = 'subsection_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($subsection) {
            $section_id = $subsection->section_id;
            $lastSubsection = Subsection::where('section_id', $section_id)->orderBy('subsection_id', 'desc')->first();
            $subsection->subsection_id = $lastSubsection ? $lastSubsection->subsection_id + 1 : $section_id . '001';
        });
    }
    protected $fillable = [
        'section_id',
        'title',
    ];

    public function section()
    {
        return $this->belongsTo(Section::class, 'section_id', 'section_id');
    }

    public function contents()
    {
        return $this->morphMany(Content::class, 'contentable');
    }
    public function module()
    {
        return $this->section->lesson->module();
    }
}
