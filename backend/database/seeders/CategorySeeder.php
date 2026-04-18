<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Graphic Design', 'icon' => '🎨', 'description' => 'Logo design, branding, illustrations'],
            ['name' => 'Web Development', 'icon' => '💻', 'description' => 'Website development, web apps, APIs'],
            ['name' => 'Content Writing', 'icon' => '✍️', 'description' => 'Blog posts, articles, copywriting'],
            ['name' => 'Video Editing', 'icon' => '🎬', 'description' => 'Video production and editing'],
            ['name' => 'Translation', 'icon' => '🌐', 'description' => 'Language translation services'],
            ['name' => 'Mobile Apps', 'icon' => '📱', 'description' => 'iOS and Android app development'],
            ['name' => 'Digital Marketing', 'icon' => '📊', 'description' => 'SEO, social media, advertising'],
            ['name' => 'Voice Over', 'icon' => '🎙️', 'description' => 'Voice recording and narration'],
            ['name' => 'SEO', 'icon' => '🔍', 'description' => 'Search engine optimization'],
            ['name' => 'Data Entry', 'icon' => '⌨️', 'description' => 'Data processing and entry'],
            ['name' => 'Animation', 'icon' => '🎞️', 'description' => '2D and 3D animation services'],
            ['name' => 'Music Production', 'icon' => '🎵', 'description' => 'Music composition and production'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'icon' => $category['icon'],
                'description' => $category['description'],
                'gig_count' => rand(50, 500),
            ]);
        }

        $this->command->info('✅ Categories seeded successfully!');
    }
}