<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PretestAnswer;
use App\Models\Question;

class PretestQuestion extends Model
{
    use HasFactory;

    protected $primaryKey = 'pretest_question_id';
    protected $table='pretest_questions';

    protected $fillable = [
        'question_id',
    ];

    public function pretest_answers(){
        return $this->belongsTo(PretestAnswer::class,'pretest_answer_id','pretest_answer_id');
    }
    public function questions(){
        return $this->belongsTo(Question::class,'question_id','question_id');
    }

}
