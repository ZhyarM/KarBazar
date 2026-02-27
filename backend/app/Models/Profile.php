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
        'phone',
        'hourly_rate',
        'skills',
        'languages',
        'education',
        'certifications',
        'work_experience',
        'portfolio',
        'social_links',
        'profile_views',
        'is_public',
        'is_available',
        'rating',
        'total_reviews',
        'total_jobs',
        'total_earnings',
        'response_time',
    ];

    protected $casts = [
        'skills' => 'array',
        'languages' => 'array',
        'education' => 'array',
        'certifications' => 'array',
        'work_experience' => 'array',
        'portfolio' => 'array',
        'social_links' => 'array',
        'rating' => 'decimal:2',
        'hourly_rate' => 'integer',
        'total_reviews' => 'integer',
        'total_jobs' => 'integer',
        'total_earnings' => 'integer',
        'response_time' => 'integer',
        'profile_views' => 'integer',
        'is_public' => 'boolean',
        'is_available' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Get gigs count for this profile's user
    public function getGigsCountAttribute()
    {
        return $this->user->gigs()->count();
    }

    // Increment profile views
    public function incrementViews()
    {
        $this->increment('profile_views');
    }
}
