<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('website');
            $table->json('education')->nullable()->after('languages');
            $table->json('certifications')->nullable()->after('education');
            $table->json('work_experience')->nullable()->after('certifications');
            $table->json('portfolio')->nullable()->after('work_experience');
            $table->json('social_links')->nullable()->after('portfolio');
            $table->integer('profile_views')->default(0)->after('social_links');
            $table->boolean('is_public')->default(true)->after('profile_views');
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'education',
                'certifications',
                'work_experience',
                'portfolio',
                'social_links',
                'profile_views',
                'is_public',
            ]);
        });
    }
};
