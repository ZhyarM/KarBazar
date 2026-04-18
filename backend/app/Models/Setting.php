<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
    ];

    // ⭐ RENAMED: Changed from get() to getValue() to avoid conflict
    public static function getValue($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }

        // Cast value based on type
        switch ($setting->type) {
            case 'number':
                return (float) $setting->value;
            case 'boolean':
                return filter_var($setting->value, FILTER_VALIDATE_BOOLEAN);
            case 'json':
                return json_decode($setting->value, true);
            default:
                return $setting->value;
        }
    }

    // ⭐ RENAMED: Changed from set() to setValue()
    public static function setValue($key, $value, $type = 'string', $description = null)
    {
        // Convert value to string for storage
        if ($type === 'json') {
            $value = json_encode($value);
        } elseif ($type === 'boolean') {
            $value = $value ? '1' : '0';
        }

        return self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'description' => $description,
            ]
        );
    }

    // Get platform fee percentage
    public static function getPlatformFee()
    {
        return self::getValue('platform_fee_percentage', 0);
    }

    // Get minimum ad price
    public static function getMinAdPrice()
    {
        return self::getValue('min_ad_price', 50);
    }

    // Get ad display duration
    public static function getAdDisplayDuration()
    {
        return self::getValue('ad_display_duration', 10);
    }
}