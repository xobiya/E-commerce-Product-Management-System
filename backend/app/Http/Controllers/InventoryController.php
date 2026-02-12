<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryRequest;
use App\Http\Requests\UpdateInventoryRequest;
use App\Models\Inventory;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $inventories = Inventory::query()->with('product');

        if ($search = $request->query('search')) {
            $inventories->whereHas('product', function ($query) use ($search) {
                $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($productId = $request->query('product_id')) {
            $inventories->where('product_id', $productId);
        }

        if ($request->boolean('low_stock')) {
            $inventories->whereColumn('quantity', '<=', 'reorder_level');
        }

        $inventories = $inventories->orderBy('updated_at', 'desc')->paginate(15);

        return response()->json($inventories);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(StoreInventoryRequest $request)
    {
        $inventory = Inventory::create($request->validated());

        return response()->json($inventory->load('product'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Inventory $inventory)
    {
        return response()->json($inventory->load('product'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function update(UpdateInventoryRequest $request, Inventory $inventory)
    {
        $inventory->update($request->validated());

        return response()->json($inventory->load('product'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inventory $inventory)
    {
        $inventory->delete();

        return response()->json(['message' => 'Inventory deleted.']);
    }
}
