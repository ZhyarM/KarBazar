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
        ]);

        $this->command->info('');
        $this->command->info('🎉 ================================');
        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('🎉 ================================');
        $this->command->info('');
        $this->command->info('📧 Test Accounts:');
        $this->command->info('  Admin: admin@karbazar.com');
        $this->command->info('  Freelancer: alex@designer.com');
        $this->command->info('  Client: john@client.com');
        $this->command->info('  Password (all): password123');
        $this->command->info('');
    }
}