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
