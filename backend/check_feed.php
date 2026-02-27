<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$p = App\Models\Post::with(['user', 'category'])->latest()->first();
echo "Keys: " . json_encode(array_keys($p->toArray())) . "\n\n";
echo "User keys: " . json_encode(array_keys($p->user->toArray())) . "\n\n";
echo "User avatar: " . ($p->user->avatar ?? 'NULL') . "\n";
echo "User name: " . ($p->user->name ?? 'NULL') . "\n";
