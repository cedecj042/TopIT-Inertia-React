<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultiChoiceSingle extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'multichoice_single_id';
    protected $table = 'multichoice_single';
    protected $fillable = [
        'name', 
        'answer', 
        'choices',
    ];
    protected $casts = [
        'choices' => 'array', // Cast to array for easy handling
    ];

    public function questions()
    {
        return $this->morphOne(Question::class, 'questionable');
    }
}
