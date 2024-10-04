<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Section;
use App\Models\Subsection;

class Table extends Model
{
    use HasFactory;
    protected $primaryKey = 'table_id';
    protected $fillable = [
        'tableable_id', 
        'tableable_type', 
        'description',
        'caption',
        'image_base64',
        'order'
    ];
    public function tableable(){
        return $this->morphTo();
    }
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
