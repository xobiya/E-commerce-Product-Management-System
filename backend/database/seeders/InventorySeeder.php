<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = [
            'ELEC-HEAD-001' => ['quantity' => 24, 'reorder_level' => 5],
            'HOME-AFRY-002' => ['quantity' => 12, 'reorder_level' => 3],
            'APP-HOOD-003' => ['quantity' => 40, 'reorder_level' => 10],
        ];

        $products = Product::query()->get(['id', 'sku']);

        foreach ($products as $product) {
            $inventory = $defaults[$product->sku] ?? ['quantity' => 10, 'reorder_level' => 2];

            Inventory::updateOrCreate(
                ['product_id' => $product->id],
                [
                    'product_id' => $product->id,
                    'quantity' => $inventory['quantity'],
                    'reorder_level' => $inventory['reorder_level'],
                ]
            );
        }
    }
}
