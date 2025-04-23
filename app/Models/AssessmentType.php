<?php

namespace App\Models;

use App\Enums\TestType;
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
    public function scopeTestType($query,$type){
        return $query->where('type',$type);
    }

    public static function getTypeIdByEnum(TestType $enum): int
    {
        return AssessmentType::query()
            ->where('type', $enum->value)
            ->value('type_id');
    }
}
