<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Update the role enum to include 'business'
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['client', 'freelancer', 'admin', 'business'])
                ->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['client', 'freelancer', 'admin'])
                ->change();
        });
    }
};
