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
        $accounts = [
            [
                'email' => 'admin@karbazar.com',
                'name' => 'Admin User',
                'role' => 'admin',
                'username' => 'admin',
                'title' => 'Platform Admin',
                'bio' => 'KarBazar platform administrator account.',
                'hourly_rate' => null,
                'skills' => null,
                'location' => 'Head Office',
            ],
            [
                'email' => 'client@karbazar.com',
                'name' => 'Client User',
                'role' => 'client',
                'username' => 'clientuser',
                'title' => 'Client',
                'bio' => 'Standard client account for testing the buyer flow.',
                'hourly_rate' => null,
                'skills' => null,
                'location' => 'Erbil, Iraq',
            ],
            [
                'email' => 'business@karbazar.com',
                'name' => 'Business User',
                'role' => 'freelancer',
                'username' => 'businessuser',
                'title' => 'Business Provider',
                'bio' => 'Business account for seller flow testing.',
                'hourly_rate' => 50,
                'skills' => ['Branding', 'Web Development', 'Marketing'],
                'location' => 'Sulaymaniyah, Iraq',
            ],
        ];

        foreach ($accounts as $account) {
            $user = User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'password' => Hash::make('password123'),
                    'role' => $account['role'],
                    'email_verified_at' => now(),
                    'is_active' => true,
                ],
            );

            Profile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'username' => $account['username'],
                    'bio' => $account['bio'],
                    'title' => $account['title'],
                    'location' => $account['location'],
                    'hourly_rate' => $account['hourly_rate'],
                    'skills' => $account['skills'],
                ],
            );
        }

        $this->command->info('✅ Three test accounts are ready:');
        $this->command->info('  Admin: admin@karbazar.com');
        $this->command->info('  Client: client@karbazar.com');
        $this->command->info('  Business: business@karbazar.com (stored as role: freelancer)');
        $this->command->info('  Password (all): password123');
    }
}
