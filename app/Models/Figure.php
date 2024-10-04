<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Section;
use App\Models\Subsection;

class Figure extends Model
{
    use HasFactory;
    protected $primaryKey='figure_id';
    protected $fillable = [
        'figureable_id', 
        'figureable_type', 
        'description',
        'caption',
        'image_base64',
        'order'
    ];
    public function figureable(){
        return $this->morphTo();
    }
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
