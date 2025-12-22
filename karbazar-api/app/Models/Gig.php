<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gig extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'category_id',
        'title',
        'description',
        'price',
        'delivery_time',
        'image_url',
        'gallery',
        'tags',
        'packages',
        'requirements',
        'faq',
        'rating',
        'review_count',
        'order_count',
        'is_active',
        'is_featured',
        'is_trending',
    ];

    protected $casts = [
        'gallery' => 'array',
        'tags' => 'array',
        'packages' => 'array',
        'rating' => 'decimal:2',
        'price' => 'integer',
        'delivery_time' => 'integer',
        'review_count' => 'integer',
        'order_count' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_trending' => 'boolean',
    ];

    // Relationships
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function favoritedBy()
    {
        return $this->morphToMany(User::class, 'favoritable', 'favorites');
    }

public function isFavoritedBy($userId)
    {
        return $this->favoritedBy()->where('user_id', $userId)->exists();
    }
}