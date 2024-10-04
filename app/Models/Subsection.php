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
    protected $fillable = [
        'section_id',
        'title',
        'content',
    ];

    public function sections(){
        return $this->belongsTo(Section::class,'section_id','section_id');
    }
    public function tables(){
        return $this->morphMany(Table::class,'tableable');
    }
    public function codes(){
        return $this->morphMany(Code::class,'codeable');
    }
    public function figures(){
        return $this->morphMany(Figure::class,'figureable');
    }
    public function questions(){
        return $this->hasMany(Question::class,'section_id');
    }
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
