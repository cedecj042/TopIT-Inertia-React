<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;

    protected $primaryKey='attachment_id';
    protected $fillable = [
        'attachmentable_id', 
        'attachmentable_type', 
        'type',
        'description',
        'order',
        'caption',
        'file_name',
        'file_path',
    ];
    public function attachmentable(){
        return $this->morphTo();
    }
}
