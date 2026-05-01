<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'name' => 'Keyboard',
            'price' => 55000,
            'stock' => 50
        ]);

        Product::create([
            'name' => 'Mouse',
            'price' => 45000,
            'stock' => 30
        ]);
    }
}
