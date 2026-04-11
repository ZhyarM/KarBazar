<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountMetadata extends Model
{
    use HasFactory;

    protected $table = 'account_metadata';

    protected $fillable = [
        'user_id',
        'organization_name',
        'company_name',
        'description',
        'team_size',
        'industry',
    ];

    protected $casts = [
        'team_size' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
