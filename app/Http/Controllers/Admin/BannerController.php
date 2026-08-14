<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Banner::latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|string',
            'link' => 'nullable|string',
            'position' => 'string'
        ]);

        $banner = Banner::create($request->only('title', 'subtitle', 'image', 'link', 'position'));
        return response()->json($banner, 201);
    }

    public function update(Request $request, Banner $banner): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|string',
            'link' => 'nullable|string',
            'position' => 'string'
        ]);

        $banner->update($request->only('title', 'subtitle', 'image', 'link', 'position'));
        return response()->json($banner);
    }

    public function destroy(Banner $banner): JsonResponse
    {
        $banner->delete();
        return response()->json(['message' => 'Banner deleted successfully']);
    }
}
