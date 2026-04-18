<?php
require __DIR__ . '/vendor/autoload.php';

// Load environment
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

// Now use DB
use Illuminate\Support\Facades\DB;

$gigs = DB::table('gigs')
    ->select('id', 'title', 'image_url', 'seller_id')
    ->limit(5)
    ->get();

echo "=== GIG IMAGE URLS ===\n";
foreach ($gigs as $gig) {
    echo "Gig ID: {$gig->id}, Title: {$gig->title}\n";
    echo "Image URL: " . ($gig->image_url ?? 'NULL') . "\n";
    echo "---\n";
}

echo "\n=== USER PROFILES ===\n";
$profiles = DB::table('profiles')
    ->select('id', 'username', 'avatar_url', 'cover_url')
    ->limit(3)
    ->get();

foreach ($profiles as $profile) {
    echo "Profile ID: {$profile->id}, Username: {$profile->username}\n";
    echo "Avatar: " . ($profile->avatar_url ?? 'NULL') . "\n";
    echo "Cover: " . ($profile->cover_url ?? 'NULL') . "\n";
    echo "---\n";
}

echo "\n=== USERS ===\n";
$users = DB::table('users')
    ->select('id', 'name', 'image')
    ->limit(3)
    ->get();

foreach ($users as $user) {
    echo "User ID: {$user->id}, Name: {$user->name}\n";
    echo "Image: " . ($user->image ?? 'NULL') . "\n";
    echo "---\n";
}
