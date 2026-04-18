<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Change column types to decimal
            $table->decimal('platform_fee_percentage', 5, 2)->default(0)->change();
            $table->decimal('platform_fee_amount', 10, 2)->default(0)->change();
            $table->decimal('seller_earnings', 10, 2)->default(0)->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->integer('platform_fee_percentage')->default(0)->change();
            $table->integer('platform_fee_amount')->default(0)->change();
            $table->integer('seller_earnings')->default(0)->change();
        });
    }
};