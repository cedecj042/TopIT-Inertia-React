<?php

namespace App\Models;

use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasFactory;

    protected $primaryKey='content_id';
    protected $fillable = [
        'contentable_id', 
        'contentable_type', 
        'type',
        'description',
        'order',
        'caption',
        'file_name',
        'file_path',
    ];

    public function contentable(){
        return $this->morphTo();
    }
}
