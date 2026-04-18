<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\PostLike;
use App\Models\PostComment;
use App\Models\PostBookmark;
use App\Models\Follow;
use App\Models\User;
use App\Models\Category;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $freelancers = User::where('role', 'freelancer')->get();
        $clients = User::where('role', 'client')->get();
        $allUsers = User::all();
        $categories = Category::all();

        if ($freelancers->isEmpty()) {
            $this->command->warn('⚠️ No freelancers found. Please seed users first!');
            return;
        }

        // ── Posts ──────────────────────────────────────────────
        $postsData = [
            [
                'title' => 'Just finished a complete brand identity for a tech startup! 🎨',
                'description' => "Super excited to share my latest project! I designed the full brand identity for NovaTech — including the logo, color palette, typography, business cards, and social media kit.\n\nThe client wanted something modern and minimal that communicates innovation. After 3 rounds of concepts we landed on this clean geometric mark.\n\nTools used: Figma, Adobe Illustrator\n\nAlways open for new branding projects — DM me if you need a fresh look for your brand!",
                'category' => 'Graphic Design',
                'tags' => ['branding', 'logo', 'design', 'startup', 'identity'],
                'images' => ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800'],
            ],
            [
                'title' => 'How I built a real-time chat app with Laravel & React in 3 days',
                'description' => "Wanted to share a quick breakdown of a mini-project I completed this week.\n\nStack:\n• Backend: Laravel 11 + Sanctum + Pusher\n• Frontend: React 19 + TypeScript\n• Database: MySQL\n\nFeatures:\n✅ Real-time messaging with WebSockets\n✅ Read receipts\n✅ File attachments\n✅ Typing indicators\n✅ Online/offline status\n\nThe trickiest part was handling the WebSocket connection gracefully on mobile. Happy to share the approach if anyone's interested!\n\n#webdev #laravel #react",
                'category' => 'Web Development',
                'tags' => ['laravel', 'react', 'websockets', 'fullstack', 'tutorial'],
                'images' => ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'],
            ],
            [
                'title' => '5 SEO mistakes I see every single week (and how to fix them)',
                'description' => "After auditing 200+ websites this year, here are the top 5 SEO mistakes I keep seeing:\n\n1️⃣ Missing meta descriptions — Google pulls random text from your page instead\n2️⃣ No alt text on images — You're leaving accessibility AND ranking points on the table\n3️⃣ Slow page speed — If it takes more than 3 seconds, 53% of visitors bounce\n4️⃣ Not using internal linking — Your own pages should support each other\n5️⃣ Ignoring mobile optimization — 60%+ of traffic is mobile now\n\nFix these and you'll see results within weeks. Need help? I offer free 15-minute SEO consultations for small businesses.",
                'category' => 'SEO',
                'tags' => ['seo', 'tips', 'marketing', 'google', 'ranking'],
                'images' => [],
            ],
            [
                'title' => 'Created a 30-second explainer animation for a fintech app 🎬',
                'description' => "Just delivered this explainer video for PayFlow, a mobile payment app.\n\nThe brief was to explain their core features in under 30 seconds — fast, colorful, and engaging.\n\nProcess:\n1. Script & storyboard (1 day)\n2. Character design & asset creation (2 days)\n3. Animation in After Effects (3 days)\n4. Sound design & music (1 day)\n\nTotal turnaround: 7 days\n\nAnimation is such a powerful tool for SaaS companies. If you need one for your product, let's talk!",
                'category' => 'Animation',
                'tags' => ['animation', 'explainer', 'motion-graphics', 'aftereffects'],
                'images' => ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'],
            ],
            [
                'title' => 'My YouTube editing workflow that saves me 10+ hours per week',
                'description' => "As a full-time video editor handling 5-6 YouTube channels, efficiency is everything.\n\nHere's my current workflow:\n\n🎯 Premiere Pro for main editing\n🎯 After Effects for intros/outros & motion graphics\n🎯 DaVinci Resolve for color grading\n🎯 Epidemic Sound for music\n🎯 Frame.io for client reviews\n\nBiggest time-savers:\n• Custom keyboard shortcuts — saves ~2hrs/week\n• Preset library for effects — saves ~3hrs/week\n• Template-based editing — saves ~5hrs/week\n\nWhat tools do you use? Drop your workflow below! 👇",
                'category' => 'Video Editing',
                'tags' => ['video-editing', 'youtube', 'premiere-pro', 'workflow', 'tips'],
                'images' => ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800', 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800'],
            ],
            [
                'title' => 'Content writing tip: The "So What?" test will 10x your writing',
                'description' => "The single best writing tip I ever received:\n\nAfter every sentence you write, ask yourself \"So what?\"\n\nIf the sentence doesn't provide value, remove it.\n\nExample:\n❌ \"Our company was founded in 2010.\" (So what?)\n✅ \"Since 2010, we've helped 10,000+ businesses grow their online presence.\"\n\nThe first tells me a fact. The second tells me why I should care.\n\nApply this to:\n• Blog posts\n• Landing pages\n• Email campaigns\n• Social media posts\n\nYour readers' time is precious. Respect it. 🙏",
                'category' => 'Content Writing',
                'tags' => ['writing', 'copywriting', 'tips', 'content-marketing'],
                'images' => [],
            ],
            [
                'title' => 'Completed a cross-platform delivery app with Flutter 📱',
                'description' => "Thrilled to share my latest mobile app project — a food delivery app built with Flutter!\n\nKey features:\n🍕 Real-time order tracking with Google Maps\n🍕 In-app payments (Stripe)\n🍕 Push notifications\n🍕 Rating & review system\n🍕 Restaurant dashboard\n🍕 Driver app with route optimization\n\nOne codebase, runs beautifully on both iOS and Android. The client saved 40% compared to building native apps separately.\n\nFlutter continues to impress me with every project. Who else is building with Flutter?",
                'category' => 'Mobile Apps',
                'tags' => ['flutter', 'mobile', 'ios', 'android', 'delivery-app'],
                'images' => ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800'],
            ],
            [
                'title' => 'How I grew a client\'s Instagram from 500 to 50K followers in 6 months',
                'description' => "Case study time! 📊\n\nClient: Local bakery in Austin, TX\nGoal: Grow Instagram presence and drive foot traffic\n\nStrategy:\n1. Content pillars: Behind-the-scenes, recipes, customer stories\n2. Posting schedule: 5x/week (Reels: 3, Carousels: 1, Stories: daily)\n3. Engagement strategy: Reply to every comment within 1 hour\n4. Hashtag research: Mix of niche (5K-50K) and broad tags\n5. Collaborations: 2 local influencer partnerships/month\n\nResults after 6 months:\n📈 500 → 50,000 followers\n📈 300% increase in store visits\n📈 45% of new customers said they found the bakery on Instagram\n\nOrganic growth IS still possible in 2026. You just need the right strategy.",
                'category' => 'Digital Marketing',
                'tags' => ['instagram', 'social-media', 'growth', 'marketing', 'case-study'],
                'images' => ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800'],
            ],
            [
                'title' => '🎙️ Tips for recording professional voiceovers at home',
                'description' => "You don't need a $10,000 studio to record great voiceovers. Here's my home setup:\n\nEquipment (~$500 total):\n• Rode NT1-A microphone\n• Focusrite Scarlett Solo audio interface\n• Pop filter + boom arm\n• Acoustic foam panels (DIY works too!)\n\nRecording tips:\n1. Record in the quietest room — closets work great!\n2. Keep 6-8 inches from the mic\n3. Stay hydrated — dry mouth = bad takes\n4. Do 3 takes minimum for every line\n5. Record room tone for 10 seconds (helps in editing)\n\nSoftware: Audacity (free!) or Adobe Audition\n\nI've been doing professional voiceover work for 4 years from home. AMA! 🎤",
                'category' => 'Voice Over',
                'tags' => ['voiceover', 'recording', 'tips', 'home-studio', 'audio'],
                'images' => ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'],
            ],
            [
                'title' => 'Redesigned an entire e-commerce UI — here\'s the before & after',
                'description' => "Just wrapped up a UI/UX redesign for an online fashion store.\n\nKey changes:\n🎨 Simplified navigation (reduced menu items from 12 to 5)\n🎨 Larger product images with hover zoom\n🎨 Streamlined checkout (3 steps → 1 page)\n🎨 Added quick-view modal\n🎨 Mobile-first responsive design\n\nResults after launch:\n📈 Cart abandonment dropped 35%\n📈 Mobile conversion rate increased 28%\n📈 Average session duration increased by 2 minutes\n\nGood design isn't just about looking pretty — it's about making things easy. Every pixel should serve a purpose.",
                'category' => 'Graphic Design',
                'tags' => ['ui-design', 'ux', 'ecommerce', 'redesign', 'figma'],
                'images' => ['https://images.unsplash.com/photo-1547658719-da2b51169166?w=800', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
            ],
            [
                'title' => 'Built a REST API that handles 10K requests/second with Laravel',
                'description' => "Performance optimization deep-dive 🚀\n\nI was asked to optimize a Laravel API that was struggling at 200 req/s. Here's how I got it to 10,000 req/s:\n\n1. Redis caching for frequently accessed data\n2. Database query optimization (N+1 problem was everywhere)\n3. Eager loading relationships\n4. Queue heavy operations (emails, notifications)\n5. Implemented API response caching\n6. Switched to Octane (Swoole)\n7. Database indexing on frequently queried columns\n\nBiggest win? Fixing the N+1 queries alone got us from 200 to 2,000 req/s. Always profile before optimizing!\n\nTools: Laravel Telescope, Laravel Debugbar, Redis, Swoole",
                'category' => 'Web Development',
                'tags' => ['laravel', 'api', 'performance', 'optimization', 'backend'],
                'images' => [],
            ],
            [
                'title' => 'Produced a full music track for an indie game soundtrack 🎵',
                'description' => "Just finished composing and producing the main theme for an upcoming indie RPG game!\n\nThe brief: Epic orchestral meets electronic — think Zelda meets Tron.\n\nProcess:\n🎵 Composed melody on piano\n🎵 Arranged for full virtual orchestra (strings, brass, woodwinds)\n🎵 Added electronic elements (synths, bass, drums)\n🎵 Mixed & mastered in Logic Pro\n\nTotal production time: 2 weeks\n\nI love working on game soundtracks — there's something magical about creating music that enhances a player's experience. Looking for more game projects!",
                'category' => 'Music Production',
                'tags' => ['music', 'game-soundtrack', 'composition', 'production'],
                'images' => ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'],
            ],
        ];

        $createdPosts = [];

        foreach ($postsData as $index => $postData) {
            $freelancer = $freelancers[$index % $freelancers->count()];
            $category = $categories->where('name', $postData['category'])->first();

            $post = Post::create([
                'user_id' => $freelancer->id,
                'category_id' => $category?->id,
                'title' => $postData['title'],
                'description' => $postData['description'],
                'tags' => !empty($postData['tags']) ? $postData['tags'] : null,
                'images' => !empty($postData['images']) ? $postData['images'] : null,
                'is_active' => true,
                'created_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
            ]);

            $createdPosts[] = $post;
        }

        $this->command->info('✅ ' . count($createdPosts) . ' posts created');

        // ── Likes ──────────────────────────────────────────────
        $likesCount = 0;
        foreach ($createdPosts as $post) {
            // Random users like each post
            $likers = $allUsers->random(min($allUsers->count(), rand(2, $allUsers->count())));
            foreach ($likers as $user) {
                PostLike::create([
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                ]);
                $likesCount++;
            }
            $post->update(['likes_count' => $likers->count()]);
        }
        $this->command->info("✅ {$likesCount} post likes added");

        // ── Comments ──────────────────────────────────────────────
        $sampleComments = [
            'Amazing work! This is really inspiring. 🔥',
            'Incredible quality — how long did this take you?',
            'This is exactly what I needed to see today. Thanks for sharing!',
            'I\'d love to collaborate on something like this!',
            'Great tips! Already bookmarking this for later.',
            'The attention to detail here is next level.',
            'Can you share more about your process?',
            'This is brilliant! Keep up the amazing work! 💪',
            'Really helpful breakdown, thank you!',
            'Just followed you — looking forward to more content like this.',
            'How much would a project like this cost?',
            'The design is so clean and modern. Love it!',
            'This is the kind of quality content I come here for.',
            'Wow, those results are impressive! 📈',
            'What tools did you use for this?',
        ];

        $sampleReplies = [
            'Thank you so much! 🙏',
            'Appreciate the kind words!',
            'This took about a week from start to finish.',
            'Sure! Feel free to DM me anytime.',
            'Glad you found it helpful!',
            'Thanks for the follow! More content coming soon.',
        ];

        $commentsCount = 0;
        foreach ($createdPosts as $post) {
            $numComments = rand(1, 5);
            $commenters = $allUsers->random(min($allUsers->count(), $numComments));

            foreach ($commenters as $user) {
                $comment = PostComment::create([
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                    'content' => $sampleComments[array_rand($sampleComments)],
                    'created_at' => $post->created_at->addHours(rand(1, 48)),
                ]);
                $commentsCount++;

                // 40% chance the post author replies
                if (rand(1, 100) <= 40) {
                    PostComment::create([
                        'user_id' => $post->user_id,
                        'post_id' => $post->id,
                        'content' => $sampleReplies[array_rand($sampleReplies)],
                        'parent_id' => $comment->id,
                        'created_at' => $comment->created_at->addMinutes(rand(5, 120)),
                    ]);
                    $commentsCount++;
                }
            }

            $post->update(['comments_count' => PostComment::where('post_id', $post->id)->count()]);
        }
        $this->command->info("✅ {$commentsCount} comments added");

        // ── Follows ──────────────────────────────────────────────
        $followsCount = 0;

        // All clients follow some freelancers
        foreach ($clients as $client) {
            $toFollow = $freelancers->random(min($freelancers->count(), rand(2, $freelancers->count())));
            foreach ($toFollow as $freelancer) {
                $created = Follow::firstOrCreate([
                    'follower_id' => $client->id,
                    'following_id' => $freelancer->id,
                ]);
                if ($created->wasRecentlyCreated) $followsCount++;
            }
        }

        // Freelancers follow each other
        foreach ($freelancers as $freelancer) {
            $others = $freelancers->where('id', '!=', $freelancer->id);
            $toFollow = $others->random(min($others->count(), rand(1, 3)));
            foreach ($toFollow as $other) {
                $created = Follow::firstOrCreate([
                    'follower_id' => $freelancer->id,
                    'following_id' => $other->id,
                ]);
                if ($created->wasRecentlyCreated) $followsCount++;
            }
        }

        $this->command->info("✅ {$followsCount} follow relationships created");

        // ── Bookmarks ──────────────────────────────────────────────
        $bookmarksCount = 0;
        foreach ($allUsers as $user) {
            $toBookmark = collect($createdPosts)->random(min(count($createdPosts), rand(1, 4)));
            foreach ($toBookmark as $post) {
                $created = PostBookmark::firstOrCreate([
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                ]);
                if ($created->wasRecentlyCreated) $bookmarksCount++;
            }
        }
        $this->command->info("✅ {$bookmarksCount} bookmarks added");
    }
}
