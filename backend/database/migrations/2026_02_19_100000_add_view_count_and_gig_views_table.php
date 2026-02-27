<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add view_count to gigs table
        if (!Schema::hasColumn('gigs', 'view_count')) {
            Schema::table('gigs', function (Blueprint $table) {
                $table->integer('view_count')->default(0)->after('order_count');
            });
        }

        // Create gig_views tracking table
        Schema::create('gig_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gig_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Prevent duplicate views per user or IP
            $table->unique(['gig_id', 'user_id']);
            $table->index(['gig_id', 'ip_address']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gig_views');

        if (Schema::hasColumn('gigs', 'view_count')) {
            Schema::table('gigs', function (Blueprint $table) {
                $table->dropColumn('view_count');
            });
        }
    }
};
