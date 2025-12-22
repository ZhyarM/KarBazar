<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'username',
        'bio',
        'title',
        'avatar_url',
        'cover_url',
        'location',
        'website',
        'hourly_rate',
        'skills',
        'languages',
        'rating',
        'total_reviews',
        'total_jobs',
        'total_earnings',
        'response_time',
    ];

    protected $casts = [
        'skills' => 'array',
        'languages' => 'array',
        'rating' => 'decimal:2',
        'hourly_rate' => 'integer',
        'total_reviews' => 'integer',
        'total_jobs' => 'integer',
        'total_earnings' => 'integer',
        'response_time' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}