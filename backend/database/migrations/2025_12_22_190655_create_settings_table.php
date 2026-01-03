<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, number, boolean, json
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('settings')->insert([
            [
                'key' => 'platform_fee_percentage',
                'value' => '0',
                'type' => 'number',
                'description' => 'Platform fee percentage (0-100)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'min_ad_price',
                'value' => '50',
                'type' => 'number',
                'description' => 'Minimum price for advertising',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'ad_display_duration',
                'value' => '10',
                'type' => 'number',
                'description' => 'Default ad display duration in seconds',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};