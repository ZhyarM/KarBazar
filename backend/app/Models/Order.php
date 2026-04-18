<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'gig_id',
        'buyer_id',
        'seller_id',
        'status',
        'price',
        'platform_fee_percentage',
        'platform_fee_amount',
        'seller_earnings',
        'delivery_time',
        'requirements',
        'delivery_note',
        'delivery_files',
        'completed_at',
    ];

    protected $casts = [
        'delivery_files' => 'array',
        'price' => 'integer',
        'delivery_time' => 'integer',
        'completed_at' => 'datetime',
        'platform_fee_percentage' => 'decimal:2',
        'platform_fee_amount' => 'decimal:2',
        'seller_earnings' => 'decimal:2',
    ];

    // Relationships
    public function gig()
    {
        return $this->belongsTo(Gig::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}