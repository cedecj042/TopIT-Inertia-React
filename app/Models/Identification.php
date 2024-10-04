<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Identification extends Model
{
    use HasFactory;

    protected $primaryKey = 'identification_id';

    protected $fillable = [
        'name', 
        'answer',
    ];

    public function questions()
    {
        return $this->morphOne(Question::class, 'questionable');
    }
}
