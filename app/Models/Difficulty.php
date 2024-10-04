<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Difficulty extends Model
{
    use HasFactory;

    protected $primaryKey = 'difficulty_id';
    protected $table = 'difficulty';
    protected $fillable = ['name', 'numeric'];

    public function questions()
    {
        return $this->hasMany(Question::class, 'difficulty_id', 'difficulty_id');
    }

}
