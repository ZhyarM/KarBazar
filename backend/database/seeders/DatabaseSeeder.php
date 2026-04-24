<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            UserSeeder::class,
            GigSeeder::class,
            PostSeeder::class,
        ]);

        if ((bool) env('MASSIVE_SEED', false)) {
            $this->call([
                MassiveDataSeeder::class,
            ]);
        }

        $this->command->info('');
        $this->command->info('🎉 ================================');
        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('🎉 ================================');
        $this->command->info('');
        $this->command->info('📧 Test Accounts:');
        $this->command->info('  Admin: admin@karbazar.com');
        $this->command->info('  Client: client@karbazar.com');
        $this->command->info('  Business: business@karbazar.com (role: freelancer)');
        $this->command->info('  Password (all): password123');
        $this->command->info('');
    }
}
