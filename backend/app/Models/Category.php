<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'gig_count',
    ];

    protected $casts = [
        'gig_count' => 'integer',
    ];

    // Relationships
    public function gigs()
    {
        return $this->hasMany(Gig::class);
    }
}