<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gig;
use App\Models\User;
use App\Models\Category;

class GigSeeder extends Seeder
{
    public function run(): void
    {
        $freelancers = User::where('role', 'freelancer')->get();
        $categories = Category::all();

        if ($freelancers->isEmpty() || $categories->isEmpty()) {
            $this->command->warn('⚠️ Please seed users and categories first!');
            return;
        }

        $gigs = [
            [
                'title' => 'Professional Logo Design with Unlimited Revisions',
                'description' => "I will create a modern, professional logo for your business. You will get:\n\n✅ 3 initial concepts\n✅ Unlimited revisions\n✅ High-resolution files (PNG, JPG, SVG)\n✅ Source files included\n✅ Commercial use rights\n\nPerfect for startups and established businesses looking for a fresh brand identity.\n\nWith 8+ years of experience, I've designed logos for 100+ satisfied clients across various industries.",
                'price' => 50,
                'delivery_time' => 3,
                'category' => 'Graphic Design',
                'tags' => ['logo', 'branding', 'design', 'graphic design'],
                'rating' => 4.9,
                'review_count' => 87,
                'order_count' => 156,
                'is_sponsored' => true,
            ],
            [
                'title' => 'Full Stack Web Application Development',
                'description' => "Expert full-stack developer offering custom web application development using modern technologies.\n\nServices include:\n🚀 React/Vue.js frontend\n🚀 Node.js/Laravel backend\n🚀 RESTful API development\n🚀 Database design and optimization\n🚀 Responsive design\n🚀 Deployment and maintenance\n\nI have built 50+ web applications for clients worldwide. Let's build something amazing together!",
                'price' => 500,
                'delivery_time' => 14,
                'category' => 'Web Development',
                'tags' => ['react', 'laravel', 'api', 'full stack', 'web development'],
                'rating' => 5.0,
                'review_count' => 45,
                'order_count' => 89,
                'is_sponsored' => true,
            ],
            [
                'title' => 'SEO Optimized Blog Posts and Articles',
                'description' => "Professional content writer delivering high-quality, SEO-optimized articles.\n\nWhat you get:\n📝 1000+ words per article\n📝 Keyword research included\n📝 SEO optimization\n📝 Plagiarism-free content\n📝 Unlimited revisions\n📝 Quick turnaround\n\nPerfect for blogs, websites, and online publications. I've written 500+ articles for clients in various niches.",
                'price' => 75,
                'delivery_time' => 2,
                'category' => 'Content Writing',
                'tags' => ['seo', 'writing', 'blog', 'content', 'articles'],
                'rating' => 4.8,
                'review_count' => 234,
                'order_count' => 456,
            ],
            [
                'title' => 'Professional Video Editing for YouTube',
                'description' => "I will edit your YouTube videos to perfection!\n\nIncludes:\n🎬 Color correction\n🎬 Audio enhancement\n🎬 Motion graphics\n🎬 Transitions and effects\n🎬 Thumbnail design\n🎬 Fast delivery\n\nYears of experience editing for top creators with millions of views. Your content will stand out!",
                'price' => 100,
                'delivery_time' => 3,
                'category' => 'Video Editing',
                'tags' => ['video editing', 'youtube', 'premiere pro', 'editing'],
                'rating' => 4.9,
                'review_count' => 178,
                'order_count' => 298,
                'is_sponsored' => true,
            ],
            [
                'title' => 'Custom Mobile App Development (iOS & Android)',
                'description' => "Professional mobile app developer with 5+ years experience.\n\nServices:\n📱 Native iOS/Android apps\n📱 Cross-platform (React Native/Flutter)\n📱 UI/UX design\n📱 API integration\n📱 App Store submission\n📱 Post-launch support\n\nLet's turn your idea into reality! I've launched 30+ apps on both stores.",
                'price' => 800,
                'delivery_time' => 21,
                'category' => 'Mobile Apps',
                'tags' => ['mobile app', 'ios', 'android', 'react native', 'flutter'],
                'rating' => 4.9,
                'review_count' => 56,
                'order_count' => 78,
            ],
            [
                'title' => '2D Character Animation for Explainer Videos',
                'description' => "Bring your characters to life with professional 2D animation!\n\nDeliverables:\n🎨 Smooth character animation\n🎨 Lip sync\n🎨 Background design\n🎨 Sound effects (optional)\n🎨 Multiple revisions\n\nPerfect for explainer videos, commercials, and social media content.",
                'price' => 150,
                'delivery_time' => 7,
                'category' => 'Animation',
                'tags' => ['animation', '2d', 'explainer video', 'character'],
                'rating' => 4.7,
                'review_count' => 67,
                'order_count' => 112,
            ],
            [
                'title' => 'Complete Social Media Marketing Strategy',
                'description' => "Grow your business with data-driven social media marketing!\n\nPackage includes:\n📊 Platform strategy (Instagram, Facebook, LinkedIn)\n📊 Content calendar (30 days)\n📊 Ad campaign setup\n📊 Analytics and reporting\n📊 Audience targeting\n📊 Engagement optimization\n\nProven results for 100+ clients. Average ROI increase of 300%!",
                'price' => 300,
                'delivery_time' => 5,
                'category' => 'Digital Marketing',
                'tags' => ['social media', 'marketing', 'facebook ads', 'instagram'],
                'rating' => 4.8,
                'review_count' => 145,
                'order_count' => 267,
                'is_sponsored' => true,
            ],
            [
                'title' => 'WordPress Website Design and Development',
                'description' => "Professional WordPress website tailored to your needs.\n\nIncludes:\n💻 Custom theme design\n💻 Responsive layout\n💻 SEO optimization\n💻 Plugin integration\n💻 Contact forms\n💻 Social media integration\n💻 Speed optimization\n💻 30 days support\n\nPerfect for businesses, portfolios, and blogs.",
                'price' => 250,
                'delivery_time' => 7,
                'category' => 'Web Development',
                'tags' => ['wordpress', 'web design', 'website', 'cms'],
                'rating' => 4.8,
                'review_count' => 92,
                'order_count' => 143,
            ],
            [
                'title' => 'Professional Voice Over Recording',
                'description' => "Broadcast-quality voice over for your projects.\n\nServices:\n🎙️ Commercials\n🎙️ Explainer videos\n🎙️ Audiobooks\n🎙️ IVR/Phone systems\n🎙️ E-learning\n🎙️ Quick turnaround\n🎙️ Professional studio recording\n\nMultiple languages available! Clear, engaging voice that connects with your audience.",
                'price' => 80,
                'delivery_time' => 2,
                'category' => 'Voice Over',
                'tags' => ['voice over', 'recording', 'narration', 'voiceover'],
                'rating' => 4.9,
                'review_count' => 198,
                'order_count' => 334,
            ],
            [
                'title' => 'Complete SEO Audit and Optimization',
                'description' => "Comprehensive SEO audit to boost your rankings.\n\nYou will receive:\n🔍 Technical SEO audit\n🔍 Keyword research\n🔍 Competitor analysis\n🔍 On-page optimization\n🔍 Backlink analysis\n🔍 Action plan with priorities\n🔍 Monthly progress report\n\nImprove your search visibility and drive organic traffic!",
                'price' => 200,
                'delivery_time' => 5,
                'category' => 'SEO',
                'tags' => ['seo', 'optimization', 'google ranking', 'keywords'],
                'rating' => 4.7,
                'review_count' => 76,
                'order_count' => 134,
            ],
        ];

        foreach ($gigs as $index => $gigData) {
            $category = $categories->where('name', $gigData['category'])->first();
            
            if (!$category) {
                $this->command->warn("⚠️ Category '{$gigData['category']}' not found, skipping gig.");
                continue;
            }

            $freelancer = $freelancers[$index % $freelancers->count()];

            Gig::create([
                'seller_id' => $freelancer->id,
                'category_id' => $category->id,
                'title' => $gigData['title'],
                'description' => $gigData['description'],
                'price' => $gigData['price'],
                'delivery_time' => $gigData['delivery_time'],
                'tags' => json_encode($gigData['tags']),
                'rating' => $gigData['rating'],
                'review_count' => $gigData['review_count'],
                'order_count' => $gigData['order_count'],
                'is_active' => true,
                'is_featured' => $gigData['is_sponsored'] ?? false,
            ]);
        }

        $this->command->info('✅ Gigs seeded successfully!');
    }
}