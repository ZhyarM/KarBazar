<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('company_name')->nullable();
            $table->string('phone')->nullable();
            $table->text('message');
            $table->decimal('budget', 10, 2)->nullable();
            $table->enum('ad_type', ['image', 'video'])->default('image');
            $table->integer('duration_days')->default(7); // how many days to run ad
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_requests');
    }
};