<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'userable_id',
        'userable_type',
        'username',
        'email',
        'password',
        'remember_token',
        'email_verified_at'
    ];
    protected $table = 'users';
    protected $primaryKey = 'user_id';

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userable()
    {
        return $this->morphTo();
    }

    public function isAdmin()
    {
        return $this->userable instanceof Admin;
    }

    public function isStudent()
    {
        return $this->userable instanceof Student;
    }


    protected static function booted()
    {
        static::deleting(function ($user) {
            // delete related model based on userable type
            if ($user->isAdmin()) {
                $user->userable()->delete();
            } elseif ($user->isStudent()) {
                $user->userable()->delete();
            }
        });
    }
}
