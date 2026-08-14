<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with(['category', 'brand', 'variants'])->latest()->get();
        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'is_on_sale' => 'boolean',
            'image' => 'nullable|string',
            'variants' => 'nullable|array',
            'variants.*.size' => 'required|string',
            'variants.*.color' => 'required|string',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.sku' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($request) {
            $totalStock = 0;
            $variantsData = $request->input('variants', []);
            foreach ($variantsData as $v) {
                $totalStock += (int)$v['stock'];
            }

            $product = Product::create([
                'category_id' => $request->category_id,
                'brand_id' => $request->brand_id,
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'price' => $request->price,
                'sale_price' => $request->sale_price,
                'is_on_sale' => $request->is_on_sale ?? false,
                'stock' => $totalStock,
                'image' => $request->image ?? '/assets/product_silk.jpg'
            ]);

            foreach ($variantsData as $v) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'size' => $v['size'],
                    'color' => $v['color'],
                    'stock' => $v['stock'],
                    'sku' => $v['sku'] ?? (strtoupper(substr($product->name, 0, 3)) . '-' . strtoupper($v['size']) . '-' . rand(100, 999))
                ]);
            }

            return response()->json($product->load('variants'), 201);
        });
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'name' => "required|string|max:255|unique:products,name,{$product->id}",
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'is_on_sale' => 'boolean',
            'image' => 'nullable|string',
            'variants' => 'nullable|array',
            'variants.*.size' => 'required|string',
            'variants.*.color' => 'required|string',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.sku' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($request, $product) {
            $totalStock = 0;
            $variantsData = $request->input('variants', []);
            foreach ($variantsData as $v) {
                $totalStock += (int)$v['stock'];
            }

            $product->update([
                'category_id' => $request->category_id,
                'brand_id' => $request->brand_id,
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'price' => $request->price,
                'sale_price' => $request->sale_price,
                'is_on_sale' => $request->is_on_sale ?? false,
                'stock' => $totalStock,
                'image' => $request->image ?? $product->image
            ]);

            // Sync Variants: delete old ones and recreate
            $product->variants()->delete();
            foreach ($variantsData as $v) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'size' => $v['size'],
                    'color' => $v['color'],
                    'stock' => $v['stock'],
                    'sku' => $v['sku'] ?? (strtoupper(substr($product->name, 0, 3)) . '-' . strtoupper($v['size']) . '-' . rand(100, 999))
                ]);
            }

            return response()->json($product->load('variants'));
        });
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}
