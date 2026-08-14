<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Brand::latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:brands,name',
            'description' => 'nullable|string'
        ]);

        $brand = Brand::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description
        ]);

        return response()->json($brand, 201);
    }

    public function update(Request $request, Brand $brand): JsonResponse
    {
        $request->validate([
            'name' => "required|string|max:255|unique:brands,name,{$brand->id}",
            'description' => 'nullable|string'
        ]);

        $brand->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description
        ]);

        return response()->json($brand);
    }

    public function destroy(Brand $brand): JsonResponse
    {
        $brand->delete();
        return response()->json(['message' => 'Brand deleted successfully']);
    }
}
