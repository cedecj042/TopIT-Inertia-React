<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Section;
use App\Models\Subsection;

class Code extends Model
{
    use HasFactory;
    protected $primaryKey='code_id';
    protected $fillable = [
        'codeable_id', 
        'codeable_type', 
        'description',
        'caption',
        'image_base64',
        'order'
    ];
    public function codeable(){
        return $this->morphTo();
    }
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
