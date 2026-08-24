<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    // ── Public Storefront ────────────────────────────────────────────

    public function home(Request $request): Response
    {
        $query = Product::with(['category', 'brand', 'variants']);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%{$s}%")
                ->orWhere('description', 'like', "%{$s}%"));
        }
        if ($request->filled('category') && $request->category !== 'All') {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        return Inertia::render('user/Home', [
            'initialProducts' => $query->latest()->limit(12)->get(),
            'banners'         => Banner::where('position', 'homepage')->latest()->get(),
            'brands'          => Brand::latest()->get(),
            'categories'      => Category::latest()->get(),
            'filters'         => $request->only('search', 'category'),
        ]);
    }

    public function catalog(Request $request): Response
    {
        $query = Product::with(['category', 'brand', 'variants']);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%{$s}%")
                ->orWhere('description', 'like', "%{$s}%"));
        }
        if ($request->filled('category') && $request->category !== 'All') {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->filled('brand')) {
            $query->whereHas('brand', fn($q) => $q->where('slug', $request->brand));
        }
        if ($request->filled('size')) {
            $query->whereHas('variants', fn($q) => $q->where('size', $request->size));
        }
        if ($request->filled('color')) {
            $query->whereHas('variants', fn($q) => $q->where('color', $request->color));
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->max_price);
        }

        return Inertia::render('user/Products', [
            'initialProducts' => $query->latest()->get(),
            'brands'          => Brand::latest()->get(),
            'categories'      => Category::latest()->get(),
            'filters'         => $request->only('search', 'category', 'brand', 'size', 'color', 'min_price', 'max_price'),
        ]);
    }

    public function productDetail(int $id): Response
    {
        $product = Product::with(['category', 'brand', 'variants'])->findOrFail($id);

        return Inertia::render('user/ProductDetail', [
            'product' => $product,
        ]);
    }

    public function categories(): Response
    {
        return Inertia::render('user/Categories', [
            'categories' => Category::latest()->get(),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('user/About');
    }

    public function contact(): Response
    {
        return Inertia::render('user/Contact');
    }

    public function checkout(): Response
    {
        return Inertia::render('user/Checkout');
    }

    // ── Auth Pages ───────────────────────────────────────────────────

    public function login(): Response
    {
        return Inertia::render('auth/Login');
    }

    public function register(): Response
    {
        return Inertia::render('auth/Register');
    }

    // ── User Pages ───────────────────────────────────────────────────

    public function userDashboard(Request $request): Response
    {
        $user = $request->user()->load('roles');

        return Inertia::render('user/Dashboard', [
            'roles'       => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }

    public function userProfile(Request $request): Response
    {
        return Inertia::render('user/Profile');
    }
}
