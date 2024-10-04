<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Module;
use App\Models\Section;

class Lesson extends Model
{
    use HasFactory;
    protected $primaryKey='lesson_id';

    protected $fillable = [
        'module_id',
        'title',
        'content',
    ];
    
    public function modules(){
        return $this->belongsTo(Module::class,'module_id','module_id');
    }

    public function sections(){
        return $this->hasMany(Section::class,'lesson_id');
    }
}
