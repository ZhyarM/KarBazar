<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@karbazar.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $admin->id,
            'username' => 'admin',
            'bio' => 'KarBazar Platform Administrator',
            'title' => 'Platform Admin',
        ]);

        $this->command->info('✅ Admin user created: admin@karbazar.com / password123');

        // Sample Clients
        $clients = [
            ['name' => 'John Client', 'email' => 'john@client.com'],
            ['name' => 'Sarah Business', 'email' => 'sarah@business.com'],
            ['name' => 'Mike Startup', 'email' => 'mike@startup.com'],
        ];

        foreach ($clients as $clientData) {
            $client = User::create([
                'name' => $clientData['name'],
                'email' => $clientData['email'],
                'password' => Hash::make('password123'),
                'role' => 'client',
                'email_verified_at' => now(),
            ]);

            Profile::create([
                'user_id' => $client->id,
                'username' => strtolower(str_replace(' ', '', $clientData['name'])),
                'bio' => 'Client on KarBazar marketplace',
            ]);
        }

        $this->command->info('✅ Client users created (password: password123)');

        // Sample Freelancers
        $freelancers = [
            [
                'name' => 'Alex Designer',
                'email' => 'alex@designer.com',
                'title' => 'Senior Graphic Designer',
                'bio' => 'Professional graphic designer with 8+ years of experience. Specializing in logo design, branding, and illustrations.',
                'skills' => ['Photoshop', 'Illustrator', 'Figma', 'Branding', 'Logo Design'],
                'hourly_rate' => 50,
                'location' => 'New York, USA',
                'rating' => 4.9,
                'total_reviews' => 156,
            ],
            [
                'name' => 'Emma Developer',
                'email' => 'emma@dev.com',
                'title' => 'Full Stack Developer',
                'bio' => 'Experienced full-stack developer specializing in React, Node.js, and Laravel. Building scalable web applications.',
                'skills' => ['React', 'Node.js', 'Laravel', 'MySQL', 'API Development'],
                'hourly_rate' => 75,
                'location' => 'London, UK',
                'rating' => 5.0,
                'total_reviews' => 89,
            ],
            [
                'name' => 'Carlos Writer',
                'email' => 'carlos@writer.com',
                'title' => 'Content Writer & SEO Specialist',
                'bio' => 'Professional content writer with expertise in SEO optimization. Creating engaging content that ranks.',
                'skills' => ['Content Writing', 'SEO', 'Copywriting', 'Blog Writing'],
                'hourly_rate' => 35,
                'location' => 'Barcelona, Spain',
                'rating' => 4.8,
                'total_reviews' => 234,
            ],
            [
                'name' => 'Priya Animator',
                'email' => 'priya@animator.com',
                'title' => '2D/3D Animator',
                'bio' => 'Creative animator bringing ideas to life. Specialized in explainer videos and character animation.',
                'skills' => ['After Effects', 'Blender', '2D Animation', '3D Modeling'],
                'hourly_rate' => 60,
                'location' => 'Mumbai, India',
                'rating' => 4.7,
                'total_reviews' => 67,
            ],
            [
                'name' => 'David VideoEditor',
                'email' => 'david@video.com',
                'title' => 'Professional Video Editor',
                'bio' => 'Expert video editor with experience in commercials, YouTube content, and corporate videos.',
                'skills' => ['Premiere Pro', 'After Effects', 'Color Grading', 'Video Editing'],
                'hourly_rate' => 55,
                'location' => 'Los Angeles, USA',
                'rating' => 4.9,
                'total_reviews' => 178,
            ],
            [
                'name' => 'Sophie Marketing',
                'email' => 'sophie@marketing.com',
                'title' => 'Digital Marketing Expert',
                'bio' => 'Results-driven digital marketer. Specializing in social media marketing, PPC, and growth strategies.',
                'skills' => ['Facebook Ads', 'Google Ads', 'Social Media', 'Analytics'],
                'hourly_rate' => 65,
                'location' => 'Sydney, Australia',
                'rating' => 4.8,
                'total_reviews' => 145,
            ],
        ];

        foreach ($freelancers as $freelancerData) {
            $freelancer = User::create([
                'name' => $freelancerData['name'],
                'email' => $freelancerData['email'],
                'password' => Hash::make('password123'),
                'role' => 'freelancer',
                'email_verified_at' => now(),
            ]);

            Profile::create([
                'user_id' => $freelancer->id,
                'username' => strtolower(str_replace(' ', '', $freelancerData['name'])),
                'bio' => $freelancerData['bio'],
                'title' => $freelancerData['title'],
                'skills' => json_encode($freelancerData['skills']),
                'hourly_rate' => $freelancerData['hourly_rate'],
                'location' => $freelancerData['location'],
                'rating' => $freelancerData['rating'],
                'total_reviews' => $freelancerData['total_reviews'],
            ]);
        }

        $this->command->info('✅ Freelancer users created (password: password123)');
    }
}