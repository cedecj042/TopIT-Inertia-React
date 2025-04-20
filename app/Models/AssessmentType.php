<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentType extends Model
{
    use HasFactory;

    protected $table = 'assessment_types';
    protected $primaryKey = 'type_id';
    protected $fillable = [
        'type',
        'total_questions',
        'evenly_distributed',
        'created_at',
        'updated_at'
    ];

    public function assessment()
    {
        return $this->hasMany(Assessment::class, 'type_id', 'type_id');
    }
}
