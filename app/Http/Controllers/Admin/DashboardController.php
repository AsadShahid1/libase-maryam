<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'stats' => [
                'total_users'       => User::count(),
                'admin_users'       => User::role('admin')->count(),
                'regular_users'     => User::role('user')->count(),
                'total_roles'       => Role::count(),
                'total_brands'      => Brand::count(),
                'total_categories'  => Category::count(),
                'total_products'    => Product::count(),
                'unread_messages'   => ContactMessage::where('read_status', false)->count()
            ],
            'recent_users' => User::with('roles')->latest()->take(5)->get(),
            'recent_messages' => ContactMessage::latest()->take(5)->get()
        ]);
    }
}
