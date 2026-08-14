<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Brand;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AdminPageController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'total_users'      => User::count(),
                'admin_users'      => User::role('admin')->count(),
                'regular_users'    => User::role('user')->count(),
                'total_roles'      => Role::count(),
                'total_brands'     => Brand::count(),
                'total_categories' => Category::count(),
                'total_products'   => Product::count(),
                'unread_messages'  => ContactMessage::where('read_status', false)->count(),
            ],
            'recent_users'    => User::with('roles')->latest()->take(5)->get(),
            'recent_messages' => ContactMessage::latest()->take(5)->get(),
        ]);
    }

    public function brands(): Response
    {
        return Inertia::render('admin/Brands', [
            'initialBrands' => Brand::latest()->get(),
        ]);
    }

    public function categories(): Response
    {
        return Inertia::render('admin/Categories', [
            'initialCategories' => Category::latest()->get(),
        ]);
    }

    public function products(): Response
    {
        return Inertia::render('admin/Products', [
            'initialProducts'   => Product::with(['category', 'brand', 'variants'])->latest()->get(),
            'categories'        => Category::latest()->get(),
            'brands'            => Brand::latest()->get(),
        ]);
    }

    public function banners(): Response
    {
        return Inertia::render('admin/Banners', [
            'initialBanners' => Banner::latest()->get(),
        ]);
    }

    public function administration(): Response
    {
        return Inertia::render('admin/Administration', [
            'initialStaff' => User::with('roles')
                ->whereHas('roles', fn($q) => $q->whereIn('name', ['admin', 'user']))
                ->latest()->get(),
        ]);
    }

    public function contacts(): Response
    {
        return Inertia::render('admin/Contacts', [
            'initialMessages' => ContactMessage::latest()->get(),
        ]);
    }

    public function settings(): Response
    {
        return Inertia::render('admin/Settings', [
            'initialSettings' => Setting::pluck('value', 'key')->toArray(),
        ]);
    }

    public function users(): Response
    {
        return Inertia::render('admin/Users', [
            'initialUsers' => User::with('roles')->latest()->paginate(15),
        ]);
    }

    public function roles(): Response
    {
        return Inertia::render('admin/Roles', [
            'initialRoles'       => Role::with('permissions')->get(),
            'initialPermissions' => Permission::all(),
        ]);
    }
}
