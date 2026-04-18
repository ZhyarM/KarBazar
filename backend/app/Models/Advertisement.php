<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'type',
        'media_url',
        'link_url',
        'duration',
        'status',
        'paid_amount',
        'start_date',
        'end_date',
        'impressions',
        'clicks',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'paid_amount' => 'decimal:2',
        'impressions' => 'integer',
        'clicks' => 'integer',
        'duration' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where(function($q) {
                $q->whereNull('start_date')
                  ->orWhere('start_date', '<=', now());
            })
            ->where(function($q) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', now());
            });
    }

    // Check if ad is expired
    public function isExpired()
    {
        if ($this->end_date && $this->end_date < now()) {
            return true;
        }
        return false;
    }

    // Increment impressions
    public function incrementImpressions()
    {
        $this->increment('impressions');
    }

    // Increment clicks
    public function incrementClicks()
    {
        $this->increment('clicks');
    }

    // Get CTR (Click Through Rate)
    public function getCTR()
    {
        if ($this->impressions == 0) {
            return 0;
        }
        return round(($this->clicks / $this->impressions) * 100, 2);
    }
}