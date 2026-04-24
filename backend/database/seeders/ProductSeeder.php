<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Product::create([
            'name' => 'Zenith Quantum Watch',
            'description' => 'A masterpiece of engineering, combining celestial precision with timeless elegance.',
            'price' => 2499.99,
            'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
        ]);

        \App\Models\Product::create([
            'name' => 'Aether Pro Headphones',
            'description' => 'Immerse yourself in pure sonic clarity with active noise cancellation and spatial audio.',
            'price' => 549.50,
            'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'
        ]);

        \App\Models\Product::create([
            'name' => 'Lumina Smart Desk',
            'description' => 'Revolutionize your workspace with integrated wireless charging and dynamic ambient lighting.',
            'price' => 1299.00,
            'image' => 'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=1000&auto=format&fit=crop'
        ]);

        \App\Models\Product::create([
            'name' => 'Nebula S1 Camera',
            'description' => 'Capture the essence of every moment with professional-grade optics and AI enhancement.',
            'price' => 3200.00,
            'image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop'
        ]);
    }
}
