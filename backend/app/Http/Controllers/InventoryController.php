<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryRequest;
use App\Http\Requests\UpdateInventoryRequest;
use App\Models\Inventory;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inventories = Inventory::query()
            ->with('product')
            ->orderBy('updated_at', 'desc')
            ->paginate(15);

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
