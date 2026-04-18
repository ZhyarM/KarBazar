<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    // Get all settings (Admin only)
    public function index()
    {
        $settings = Setting::all();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    // Get specific setting
    public function show($key)
    {
        $value = Setting::getValue($key);

        return response()->json([
            'success' => true,
            'data' => [
                'key' => $key,
                'value' => $value,
            ],
        ]);
    }

    // Update platform fee (Admin only)
    public function updatePlatformFee(Request $request)
    {
        $request->validate([
            'platform_fee_percentage' => 'required|numeric|min:0|max:100',
        ]);

        Setting::setValue(
            'platform_fee_percentage',
            $request->platform_fee_percentage,
            'number',
            'Platform fee percentage (0-100)'
        );

        return response()->json([
            'success' => true,
            'message' => 'Platform fee updated successfully',
            'data' => [
                'platform_fee_percentage' => $request->platform_fee_percentage,
            ],
        ]);
    }

    // Update any setting (Admin only)
    public function updateSetting(Request $request)
    {
        $request->validate([
            'key' => 'required|string',
            'value' => 'required',
            'type' => 'required|in:string,number,boolean,json',
            'description' => 'nullable|string',
        ]);

        Setting::setValue(
            $request->key,
            $request->value,
            $request->type,
            $request->description
        );

        return response()->json([
            'success' => true,
            'message' => 'Setting updated successfully',
            'data' => [
                'key' => $request->key,
                'value' => $request->value,
            ],
        ]);
    }
}