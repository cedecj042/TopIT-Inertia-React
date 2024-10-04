<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;
    protected $primaryKey='admin_id';
    protected $fillable = [
        'firstname',
        'lastname',
        'profile_image',
        'last_login'
    ];

    public function user(){
        return $this->morphOne(User::class,'userable');
    }
}
