<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GigPackageDiscount extends Model
{
    use HasFactory;

    protected $fillable = [
        'gig_id',
        'package_key',
        'discount_percentage',
        'expires_at',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function gig()
    {
        return $this->belongsTo(Gig::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($subQuery) {
                $subQuery->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function scopeExpiringSoon($query)
    {
        return $query->whereBetween('expires_at', [now(), now()->addHours(48)]);
    }
}
