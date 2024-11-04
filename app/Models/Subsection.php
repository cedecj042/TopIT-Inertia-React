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
    ];

    public function section(){
        return $this->belongsTo(Section::class,'section_id','section_id');
    }

    public function attachments(){
        return $this->morphMany(Attachment::class,'attachmentable');
    }
}
