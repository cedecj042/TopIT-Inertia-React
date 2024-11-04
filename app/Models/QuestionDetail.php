<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'question_detail_id';
    protected $fillable = [
        'type',
        'answer',
        'choices',
        'created_at',
        'updated_at'
    ];
    public function questions(){
        return $this->hasMany(Question::class,'question_detail_id','question_detail_id');
    }
}
