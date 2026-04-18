<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Gig;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MassiveDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $freelancerCount = (int) env('MASSIVE_FREELANCERS', 120);
        $clientCount = (int) env('MASSIVE_CLIENTS', 260);
        $gigCount = (int) env('MASSIVE_GIGS', 1200);
        $orderCount = (int) env('MASSIVE_ORDERS', 6000);
        $postCount = (int) env('MASSIVE_POSTS', 500);
        $messageCount = (int) env('MASSIVE_MESSAGES', 4000);
        $maxFollows = (int) env('MASSIVE_FOLLOWS', 3000);
        $maxFavorites = (int) env('MASSIVE_FAVORITES', 5000);

        $this->command->info('🚀 Massive seeding started...');

        if (Category::count() === 0) {
            $this->call(CategorySeeder::class);
        }

        $categories = Category::all(['id', 'name']);
        if ($categories->isEmpty()) {
            $this->command->error('No categories found. Aborting massive seed.');
            return;
        }

        $password = Hash::make('password123');

        // 1) Create many freelancers + profiles
        $this->command->info("Creating {$freelancerCount} freelancers...");
        for ($i = 1; $i <= $freelancerCount; $i++) {
            $name = $faker->name();
            $user = User::create([
                'name' => $name,
                'email' => "massive.freelancer{$i}@karbazar.seed",
                'password' => $password,
                'role' => 'freelancer',
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            Profile::create([
                'user_id' => $user->id,
                'username' => 'biz_' . Str::slug($name) . '_' . $user->id,
                'bio' => $faker->paragraph(2),
                'title' => $faker->jobTitle(),
                'location' => $faker->city() . ', ' . $faker->country(),
                'website' => $faker->boolean(35) ? $faker->url() : null,
                'hourly_rate' => $faker->numberBetween(20, 180),
                'skills' => [
                    $faker->randomElement(['React', 'Laravel', 'SEO', 'Design', 'Video Editing']),
                    $faker->randomElement(['TypeScript', 'PHP', 'WordPress', 'Figma', 'Motion Graphics']),
                    $faker->randomElement(['Node.js', 'Vue', 'Marketing', 'Illustrator', 'Copywriting']),
                ],
                'languages' => [$faker->randomElement(['English', 'Arabic', 'Kurdish', 'Spanish'])],
                'is_public' => true,
                'is_available' => $faker->boolean(85),
                'response_time' => $faker->numberBetween(1, 24),
                'rating' => $faker->randomFloat(2, 4.2, 5.0),
                'total_reviews' => 0,
                'total_jobs' => 0,
                'total_earnings' => 0,
            ]);
        }

        // 2) Create many clients + profiles
        $this->command->info("Creating {$clientCount} clients...");
        for ($i = 1; $i <= $clientCount; $i++) {
            $name = $faker->name();
            $user = User::create([
                'name' => $name,
                'email' => "massive.client{$i}@karbazar.seed",
                'password' => $password,
                'role' => 'client',
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            Profile::create([
                'user_id' => $user->id,
                'username' => 'client_' . Str::slug($name) . '_' . $user->id,
                'bio' => $faker->sentence(),
                'location' => $faker->city() . ', ' . $faker->country(),
                'is_public' => true,
                'is_available' => true,
            ]);
        }

        $freelancerIds = User::where('role', 'freelancer')->pluck('id')->values()->all();
        $clientIds = User::where('role', 'client')->pluck('id')->values()->all();

        // 3) Massive gigs
        $this->command->info("Creating {$gigCount} gigs...");
        $gigRows = [];
        for ($i = 1; $i <= $gigCount; $i++) {
            $category = $categories->random();
            $price = $faker->numberBetween(25, 1200);
            $createdAt = $faker->dateTimeBetween('-6 months', 'now');

            $gigRows[] = [
                'seller_id' => $freelancerIds[array_rand($freelancerIds)],
                'category_id' => $category->id,
                'title' => ucfirst($faker->words($faker->numberBetween(5, 9), true)),
                'description' => $faker->paragraphs($faker->numberBetween(2, 4), true),
                'price' => $price,
                'delivery_time' => $faker->numberBetween(1, 14),
                'tags' => json_encode([
                    Str::slug($category->name),
                    Str::slug($faker->word()),
                    Str::slug($faker->word()),
                ]),
                'packages' => json_encode([
                    'basic' => [
                        'price' => $price,
                        'description' => 'Basic package',
                        'delivery_time' => $faker->numberBetween(1, 5),
                        'features' => ['1 concept', 'Source file'],
                    ],
                    'standard' => [
                        'price' => (int) round($price * 1.6),
                        'description' => 'Standard package',
                        'delivery_time' => $faker->numberBetween(2, 7),
                        'features' => ['2 concepts', 'Priority support'],
                    ],
                    'premium' => [
                        'price' => (int) round($price * 2.2),
                        'description' => 'Premium package',
                        'delivery_time' => $faker->numberBetween(3, 10),
                        'features' => ['Unlimited revisions', 'Fast delivery'],
                    ],
                ]),
                'requirements' => $faker->sentence(),
                'faq' => json_encode([
                    ['question' => 'What do you need to start?', 'answer' => $faker->sentence()],
                ]),
                'rating' => $faker->randomFloat(2, 4.0, 5.0),
                'review_count' => 0,
                'order_count' => 0,
                'view_count' => $faker->numberBetween(0, 2500),
                'is_active' => true,
                'is_featured' => $faker->boolean(10),
                'is_trending' => $faker->boolean(12),
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];

            if (count($gigRows) >= 300) {
                DB::table('gigs')->insert($gigRows);
                $gigRows = [];
            }
        }
        if (!empty($gigRows)) {
            DB::table('gigs')->insert($gigRows);
        }

        $gigs = Gig::query()->select(['id', 'seller_id', 'price', 'delivery_time'])->get()->values();
        $gigCountTotal = $gigs->count();

        if ($gigCountTotal === 0) {
            $this->command->error('No gigs created. Aborting remaining seeding.');
            return;
        }

        // 4) Massive orders
        $this->command->info("Creating {$orderCount} orders...");
        $statuses = ['pending', 'in_progress', 'delivered', 'revision', 'completed', 'cancelled'];
        $statusWeights = [
            'pending' => 12,
            'in_progress' => 18,
            'delivered' => 14,
            'revision' => 8,
            'completed' => 42,
            'cancelled' => 6,
        ];

        $pickStatus = function () use ($statusWeights) {
            $roll = random_int(1, array_sum($statusWeights));
            $running = 0;
            foreach ($statusWeights as $status => $weight) {
                $running += $weight;
                if ($roll <= $running) {
                    return $status;
                }
            }
            return 'completed';
        };

        $orderRows = [];
        for ($i = 1; $i <= $orderCount; $i++) {
            $gig = $gigs[$i % $gigCountTotal];
            $buyerId = $clientIds[array_rand($clientIds)];
            $status = $pickStatus();
            $feePercent = 10.0;
            $feeAmount = round($gig->price * ($feePercent / 100), 2);
            $sellerEarnings = round($gig->price - $feeAmount, 2);
            $createdAt = $faker->dateTimeBetween('-6 months', 'now');

            $orderRows[] = [
                'gig_id' => $gig->id,
                'buyer_id' => $buyerId,
                'seller_id' => $gig->seller_id,
                'status' => $status,
                'price' => $gig->price,
                'platform_fee_percentage' => $feePercent,
                'platform_fee_amount' => $feeAmount,
                'seller_earnings' => $sellerEarnings,
                'delivery_time' => $gig->delivery_time,
                'requirements' => $faker->sentence(),
                'delivery_note' => $status === 'completed' || $status === 'delivered'
                    ? $faker->sentence()
                    : null,
                'delivery_files' => null,
                'completed_at' => $status === 'completed'
                    ? $faker->dateTimeBetween($createdAt, 'now')
                    : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];

            if (count($orderRows) >= 500) {
                DB::table('orders')->insert($orderRows);
                $orderRows = [];
            }
        }
        if (!empty($orderRows)) {
            DB::table('orders')->insert($orderRows);
        }

        // 5) Reviews for completed orders
        $this->command->info('Creating reviews for completed orders...');
        $completedOrders = DB::table('orders')
            ->select('id', 'gig_id', 'buyer_id', 'seller_id', 'completed_at')
            ->where('status', 'completed')
            ->orderBy('id')
            ->get();

        $reviewRows = [];
        foreach ($completedOrders as $order) {
            if (random_int(1, 100) > 72) {
                continue;
            }

            $reviewRows[] = [
                'order_id' => $order->id,
                'gig_id' => $order->gig_id,
                'reviewer_id' => $order->buyer_id,
                'reviewee_id' => $order->seller_id,
                'rating' => random_int(3, 5),
                'comment' => $faker->sentence(random_int(8, 18)),
                'created_at' => $order->completed_at ?? now(),
                'updated_at' => $order->completed_at ?? now(),
            ];

            if (count($reviewRows) >= 500) {
                DB::table('reviews')->insert($reviewRows);
                $reviewRows = [];
            }
        }
        if (!empty($reviewRows)) {
            DB::table('reviews')->insert($reviewRows);
        }

        // 6) Massive posts
        $this->command->info("Creating {$postCount} posts...");
        $postRows = [];
        for ($i = 1; $i <= $postCount; $i++) {
            $createdAt = $faker->dateTimeBetween('-4 months', 'now');
            $postRows[] = [
                'user_id' => $freelancerIds[array_rand($freelancerIds)],
                'category_id' => $categories->random()->id,
                'title' => ucfirst($faker->sentence(8)),
                'description' => $faker->paragraphs(random_int(2, 4), true),
                'tags' => json_encode([$faker->word(), $faker->word(), $faker->word()]),
                'images' => null,
                'likes_count' => random_int(0, 120),
                'comments_count' => random_int(0, 40),
                'is_active' => true,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];

            if (count($postRows) >= 400) {
                DB::table('posts')->insert($postRows);
                $postRows = [];
            }
        }
        if (!empty($postRows)) {
            DB::table('posts')->insert($postRows);
        }

        // 7) Messages
        $this->command->info("Creating {$messageCount} messages...");
        $allUserIds = User::pluck('id')->values()->all();
        $messageRows = [];
        for ($i = 1; $i <= $messageCount; $i++) {
            $sender = $allUserIds[array_rand($allUserIds)];
            $receiver = $allUserIds[array_rand($allUserIds)];
            if ($sender === $receiver) {
                $receiver = $allUserIds[($i + 7) % count($allUserIds)];
            }

            $createdAt = $faker->dateTimeBetween('-3 months', 'now');
            $messageRows[] = [
                'sender_id' => $sender,
                'receiver_id' => $receiver,
                'content' => $faker->sentence(random_int(4, 16)),
                'attachments' => null,
                'is_read' => (bool) random_int(0, 1),
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];

            if (count($messageRows) >= 700) {
                DB::table('messages')->insert($messageRows);
                $messageRows = [];
            }
        }
        if (!empty($messageRows)) {
            DB::table('messages')->insert($messageRows);
        }

        // 8) Follows
        $this->command->info("Creating up to {$maxFollows} follows...");
        $followRows = [];
        $followSeen = [];
        $attempts = 0;
        while (count($followRows) < $maxFollows && $attempts < $maxFollows * 4) {
            $attempts++;
            $follower = $allUserIds[array_rand($allUserIds)];
            $following = $freelancerIds[array_rand($freelancerIds)];
            if ($follower === $following) {
                continue;
            }
            $key = $follower . ':' . $following;
            if (isset($followSeen[$key])) {
                continue;
            }
            $followSeen[$key] = true;
            $now = now();
            $followRows[] = [
                'follower_id' => $follower,
                'following_id' => $following,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        if (!empty($followRows)) {
            DB::table('follows')->insertOrIgnore($followRows);
        }

        // 9) Favorites
        $this->command->info("Creating up to {$maxFavorites} favorites...");
        $favoriteRows = [];
        $favoriteSeen = [];
        $gigIds = $gigs->pluck('id')->values()->all();
        $attempts = 0;
        while (count($favoriteRows) < $maxFavorites && $attempts < $maxFavorites * 5) {
            $attempts++;
            $userId = $allUserIds[array_rand($allUserIds)];

            $isGigFavorite = random_int(1, 100) <= 70;
            $favoritableType = $isGigFavorite ? Gig::class : User::class;
            $favoritableId = $isGigFavorite
                ? $gigIds[array_rand($gigIds)]
                : $freelancerIds[array_rand($freelancerIds)];

            if (!$isGigFavorite && $favoritableId === $userId) {
                continue;
            }

            $key = $userId . ':' . $favoritableType . ':' . $favoritableId;
            if (isset($favoriteSeen[$key])) {
                continue;
            }
            $favoriteSeen[$key] = true;

            $now = now();
            $favoriteRows[] = [
                'user_id' => $userId,
                'favoritable_type' => $favoritableType,
                'favoritable_id' => $favoritableId,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        if (!empty($favoriteRows)) {
            DB::table('favorites')->insertOrIgnore($favoriteRows);
        }

        // 10) Refresh aggregate counters for gigs/profiles/categories
        $this->command->info('Refreshing aggregate counters...');

        $gigOrderCounts = DB::table('orders')
            ->selectRaw('gig_id, COUNT(*) as total_orders')
            ->groupBy('gig_id')
            ->pluck('total_orders', 'gig_id');

        $gigReviewStats = DB::table('reviews')
            ->selectRaw('gig_id, COUNT(*) as total_reviews, ROUND(AVG(rating), 2) as avg_rating')
            ->groupBy('gig_id')
            ->get()
            ->keyBy('gig_id');

        foreach ($gigIds as $gigId) {
            $review = $gigReviewStats->get($gigId);
            DB::table('gigs')->where('id', $gigId)->update([
                'order_count' => (int) ($gigOrderCounts[$gigId] ?? 0),
                'review_count' => (int) ($review->total_reviews ?? 0),
                'rating' => (float) ($review->avg_rating ?? 0),
                'updated_at' => now(),
            ]);
        }

        $profileOrderStats = DB::table('orders')
            ->selectRaw('seller_id, COUNT(*) as jobs, COALESCE(SUM(seller_earnings), 0) as earnings')
            ->where('status', 'completed')
            ->groupBy('seller_id')
            ->get()
            ->keyBy('seller_id');

        $profileReviewStats = DB::table('reviews')
            ->selectRaw('reviewee_id, COUNT(*) as total_reviews, ROUND(AVG(rating), 2) as avg_rating')
            ->groupBy('reviewee_id')
            ->get()
            ->keyBy('reviewee_id');

        foreach ($freelancerIds as $freelancerId) {
            $orders = $profileOrderStats->get($freelancerId);
            $reviews = $profileReviewStats->get($freelancerId);

            DB::table('profiles')->where('user_id', $freelancerId)->update([
                'total_jobs' => (int) ($orders->jobs ?? 0),
                'total_earnings' => (int) round((float) ($orders->earnings ?? 0)),
                'total_reviews' => (int) ($reviews->total_reviews ?? 0),
                'rating' => (float) ($reviews->avg_rating ?? 0),
                'updated_at' => now(),
            ]);
        }

        $categoryGigCounts = DB::table('gigs')
            ->selectRaw('category_id, COUNT(*) as total')
            ->groupBy('category_id')
            ->pluck('total', 'category_id');

        foreach ($categories as $category) {
            DB::table('categories')->where('id', $category->id)->update([
                'gig_count' => (int) ($categoryGigCounts[$category->id] ?? 0),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('✅ Massive seeding completed!');
        $this->command->info('   Test password for generated users: password123');
    }
}
