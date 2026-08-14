<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Banner;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicShopController extends Controller
{
    // Public home/catalog index
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'brand', 'variants']);

        // Filter by Category
        if ($request->filled('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by Brand
        if ($request->filled('brand')) {
            $query->whereHas('brand', function($q) use ($request) {
                $q->where('slug', $request->brand);
            });
        }

        // Filter by Size (Product Variant)
        if ($request->filled('size')) {
            $query->whereHas('variants', function($q) use ($request) {
                $q->where('size', $request->size);
            });
        }

        // Filter by Color (Product Variant)
        if ($request->filled('color')) {
            $query->whereHas('variants', function($q) use ($request) {
                $q->where('color', $request->color);
            });
        }

        // Filter by Price Range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float)$request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float)$request->max_price);
        }

        // Text Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->get());
    }

    // Public product detail
    public function show(int $id): JsonResponse
    {
        $product = Product::with(['category', 'brand', 'variants'])->find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json($product);
    }

    // Autocomplete Search Suggestions
    public function searchSuggestions(Request $request): JsonResponse
    {
        $search = $request->input('q', '');
        if (strlen($search) < 2) {
            return response()->json([]);
        }

        $products = Product::where('name', 'like', "%{$search}%")
            ->select('id', 'name', 'price', 'image', 'slug')
            ->limit(5)
            ->get();

        return response()->json($products);
    }

    // Get public metadata (Banners, Categories, Brands, Settings)
    public function metadata(): JsonResponse
    {
        return response()->json([
            'banners' => Banner::where('position', 'homepage')->latest()->get(),
            'categories' => Category::latest()->get(),
            'brands' => Brand::latest()->get(),
            'settings' => Setting::pluck('value', 'key')
        ]);
    }
}
