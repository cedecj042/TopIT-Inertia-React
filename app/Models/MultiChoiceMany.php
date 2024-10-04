<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultiChoiceMany extends Model
{
    use HasFactory;
    protected $primaryKey = 'multichoice_many_id';
    protected $table = 'multichoice_many';
    protected $fillable = [
        'name', 
        'answer', 
        'choices',
    ];
    protected $casts = [
        'answer' => 'array',  // Cast to array for easy handling
        'choices' => 'array',
    ];
    public function questions()
    {
        return $this->morphOne(Question::class, 'questionable');
    }
}
