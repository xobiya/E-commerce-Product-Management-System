<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::query()
            ->with(['category', 'inventory'])
            ->orderBy('name')
            ->paginate(15);

        return response()->json($products);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());

        return response()->json($product->load(['category', 'inventory']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'inventory']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return response()->json($product->load(['category', 'inventory']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully.']);
    }
}
