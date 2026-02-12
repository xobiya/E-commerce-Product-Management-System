<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::query()->with(['category', 'inventory']);

        if ($search = $request->query('search')) {
            $products->where(function ($query) use ($search) {
                $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $products->where('status', $status);
        }

        if ($categoryId = $request->query('category_id')) {
            $products->where('category_id', $categoryId);
        }

        if ($request->query('price_min') !== null && $request->query('price_min') !== '') {
            $products->where('price', '>=', $request->query('price_min'));
        }

        if ($request->query('price_max') !== null && $request->query('price_max') !== '') {
            $products->where('price', '<=', $request->query('price_max'));
        }

        $products = $products->orderBy('name')->paginate(15);

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
