<?php
require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

// Get all gigs without images
$gigCount = DB::table('gigs')->whereNull('image_url')->count();
echo "Found {$gigCount} gigs without images\n";

// Get all image files from the gigs directory
$gigDir = __DIR__ . '/storage/app/public/gigs';
$imageFiles = [];

if (File::isDirectory($gigDir)) {
    $files = File::files($gigDir);
    foreach ($files as $file) {
        $filename = $file->getBasename();
        if (in_array(pathinfo($filename, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'gif'])) {
            $imageFiles[] = 'gigs/' . $filename;
        }
    }
}

echo "Found " . count($imageFiles) . " image files on disk\n";

if (count($imageFiles) > 0) {
    // Get all gigs without images
    $gigs = DB::table('gigs')->whereNull('image_url')->limit(count($imageFiles))->get();

    echo "Assigning images to gigs...\n";

    $index = 0;
    foreach ($gigs as $gig) {
        if ($index < count($imageFiles)) {
            DB::table('gigs')
                ->where('id', $gig->id)
                ->update([
                    'image_url' => $imageFiles[$index],
                    'updated_at' => now(),
                ]);
            echo "Gig {$gig->id} ({$gig->title}): {$imageFiles[$index]}\n";
            $index++;
        }
    }

    echo "\nAssignment complete!\n";
}

// Also update profiles with avatar images
echo "\n=== UPDATING PROFILES ===\n";

$avatarDir = __DIR__ . '/storage/app/public/avatars';
$avatarFiles = [];

if (File::isDirectory($avatarDir)) {
    $files = File::files($avatarDir);
    foreach ($files as $file) {
        $filename = $file->getBasename();
        if (in_array(pathinfo($filename, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'gif'])) {
            $avatarFiles[] = 'avatars/' . $filename;
        }
    }
}

echo "Found " . count($avatarFiles) . " avatar files on disk\n";

if (count($avatarFiles) > 0) {
    $profiles = DB::table('profiles')->whereNull('avatar_url')->limit(count($avatarFiles))->get();

    $index = 0;
    foreach ($profiles as $profile) {
        if ($index < count($avatarFiles)) {
            DB::table('profiles')
                ->where('id', $profile->id)
                ->update([
                    'avatar_url' => $avatarFiles[$index],
                    'updated_at' => now(),
                ]);
            echo "Profile {$profile->id} ({$profile->username}): {$avatarFiles[$index]}\n";
            $index++;
        }
    }
}

// Update cover images
echo "\n=== UPDATING COVERS ===\n";

$coverDir = __DIR__ . '/storage/app/public/covers';
$coverFiles = [];

if (File::isDirectory($coverDir)) {
    $files = File::files($coverDir);
    foreach ($files as $file) {
        $filename = $file->getBasename();
        if (in_array(pathinfo($filename, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'gif'])) {
            $coverFiles[] = 'covers/' . $filename;
        }
    }
}

echo "Found " . count($coverFiles) . " cover files on disk\n";

if (count($coverFiles) > 0) {
    $profiles = DB::table('profiles')->whereNull('cover_url')->limit(count($coverFiles))->get();

    $index = 0;
    foreach ($profiles as $profile) {
        if ($index < count($coverFiles)) {
            DB::table('profiles')
                ->where('id', $profile->id)
                ->update([
                    'cover_url' => $coverFiles[$index],
                    'updated_at' => now(),
                ]);
            echo "Profile Cover {$profile->id} ({$profile->username}): {$coverFiles[$index]}\n";
            $index++;
        }
    }
}

echo "\n=== COMPLETE ===\n";
