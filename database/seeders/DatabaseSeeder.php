<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // testing users
        $testUsers = [
            ['name' => 'Admin 1', 'email' => 'admin1@example.com'],
            ['name' => 'Admin 2', 'email' => 'admin2@example.com'],
            ['name' => 'Admin 3', 'email' => 'admin3@example.com'],
        ];

        foreach ($testUsers as $userData) {
            User::factory()->create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password123'),
            ]);
        }

        // product seeder
        $this->call([
            ProductSeeder::class,
        ]);
    }
}
