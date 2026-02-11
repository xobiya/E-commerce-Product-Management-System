<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoryMap = Category::query()
            ->whereIn('slug', ['electronics', 'home-kitchen', 'apparel'])
            ->pluck('id', 'slug');

        $products = [
            [
                'category_slug' => 'electronics',
                'name' => 'Wireless Headphones',
                'sku' => 'ELEC-HEAD-001',
                'description' => 'Noise-cancelling over-ear headphones.',
                'price' => 129.99,
                'status' => 'active',
            ],
            [
                'category_slug' => 'home-kitchen',
                'name' => 'Smart Air Fryer',
                'sku' => 'HOME-AFRY-002',
                'description' => '5L smart air fryer with presets.',
                'price' => 89.50,
                'status' => 'active',
            ],
            [
                'category_slug' => 'apparel',
                'name' => 'Classic Hoodie',
                'sku' => 'APP-HOOD-003',
                'description' => 'Unisex cotton hoodie.',
                'price' => 39.00,
                'status' => 'active',
            ],
        ];

        foreach ($products as $product) {
            $categoryId = $categoryMap[$product['category_slug']] ?? null;
            if (!$categoryId) {
                continue;
            }

            Product::updateOrCreate(
                ['sku' => $product['sku']],
                [
                    'category_id' => $categoryId,
                    'name' => $product['name'],
                    'sku' => $product['sku'],
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'status' => $product['status'],
                    'image_url' => null,
                ]
            );
        }
    }
}
