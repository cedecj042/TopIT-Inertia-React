<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';
    protected $primaryKey = 'notification_id';
    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'is_read',
        'created_at',
        'updated_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }
}
