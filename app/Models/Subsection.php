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
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($subsection) {
            if (!$subsection->subsection_uid) {
                $subsection->subsection_uid = 'SS' . ((Subsection::max('subsection_id') ?? 0) + 1);
            }
        });
    }
    protected $primaryKey = 'subsection_id';

    protected $fillable = [
        'subsection_uid',
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
