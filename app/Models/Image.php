<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    protected $primaryKey = 'image_id';
    protected $fillable = [
        'imageable_id',
        'imageable_type',
        'file_name',
        'file_path',
    ];

    public function imageable(){
        return $this->morphTo();
    }
    
}
