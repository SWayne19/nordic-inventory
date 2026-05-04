<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Heat Exchangers
            ['name' => 'Plate Heat Exchanger Ba-12-12 (12 plates)', 'price' => 85000, 'stock' => 50],
            ['name' => 'Plate Heat Exchanger Ba-32-30 (30 plates)', 'price' => 125000, 'stock' => 20],
            ['name' => 'Insulation Box for Heat Exchanger Ba-12', 'price' => 15000, 'stock' => 0],

            // Underfloor Heating
            ['name' => 'Underfloor Heating Manifold - 2 ways', 'price' => 180000, 'stock' => 15],
            ['name' => 'Underfloor Heating Manifold - 5 ways', 'price' => 240000, 'stock' => 0],
            ['name' => 'Underfloor Heating Manifold - 10 ways', 'price' => 350000, 'stock' => 8],
            ['name' => 'Manifold Mixing Valve Unit for UFH', 'price' => 110000, 'stock' => 25],
            ['name' => 'PEX-AL-PEX Pipe for Underfloor Heating (100m)', 'price' => 145000, 'stock' => 60],

            // Filters & Valves
            ['name' => 'Magnetic Filter for Central Heating 3/4"', 'price' => 65000, 'stock' => 40],
            ['name' => 'Magnetic Filter for Central Heating 1"', 'price' => 75000, 'stock' => 35],
            ['name' => 'Thermostatic Mixing Valve (TMV2/TMV3)', 'price' => 48000, 'stock' => 90],

            // Components & Accessories
            ['name' => 'Actuator for Manifolds (230V)', 'price' => 22000, 'stock' => 200],
            ['name' => 'Expansion Vessel for Heating System 12L', 'price' => 62000, 'stock' => 30],
            ['name' => 'Expansion Vessel for Potable Water 8L', 'price' => 58000, 'stock' => 0],
            ['name' => 'Automatic Air Vent (Chrome finish)', 'price' => 12000, 'stock' => 150],
            ['name' => 'Pressure Gauge for Manifolds (0-6 bar)', 'price' => 9500, 'stock' => 120],
            ['name' => 'Circulation Pump (Wilco Style)', 'price' => 135000, 'stock' => 22],
            ['name' => 'Ball Valve with Thermometer Blue/Red set', 'price' => 28000, 'stock' => 0],
            ['name' => 'Eurocone Fitting for PEX Pipe 16mm', 'price' => 4500, 'stock' => 500],
            ['name' => 'Thermal Fluid for Solar Heating (20L)', 'price' => 55000, 'stock' => 45],
        ];

        Product::insert($products);
    }
}
