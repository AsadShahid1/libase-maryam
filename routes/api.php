<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\AdministrationController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\User\DashboardController as UserDashboard;
use App\Http\Controllers\PublicShopController;
use App\Http\Controllers\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ── Public Routes ─────────────────────────────────────────────
Route::get('/health', fn() => response()->json(['status' => 'ok', 'app' => config('app.name')]));
Route::get('/shop', [PublicShopController::class, 'index']);
Route::get('/shop/products/{id}', [PublicShopController::class, 'show']);
Route::get('/shop/suggestions', [PublicShopController::class, 'searchSuggestions']);
Route::get('/shop/metadata', [PublicShopController::class, 'metadata']);
Route::post('/contact', [ContactController::class, 'store']);

// Public test-auth
Route::get('/test-auth', function() {
    $admin = \App\Models\User::where('email', 'admin@libasemaryam.com')->first();
    $user = \App\Models\User::where('email', 'user@libasemaryam.com')->first();
    return response()->json([
        'status' => 'success',
        'admin_user' => $admin ? [
            'name' => $admin->name,
            'roles' => $admin->getRoleNames(),
        ] : 'Not Found',
    ]);
});

// ── Authenticated Routes ──────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Current user info
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('roles', 'permissions');
        return response()->json([
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'roles'       => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'is_admin'    => $user->isAdmin(),
        ]);
    });

    // User routes
    Route::prefix('user')->group(function () {
        Route::get('/dashboard', [UserDashboard::class, 'index']);
        Route::get('/profile', [UserDashboard::class, 'profile']);
        Route::put('/profile', [UserDashboard::class, 'updateProfile']);
    });

    // Admin routes (admin role required)
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/dashboard', [AdminDashboard::class, 'index']);
        
        // E-commerce CRUDs
        Route::apiResource('brands', BrandController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('banners', BannerController::class);
        Route::apiResource('administration', AdministrationController::class);
        Route::apiResource('contacts', ContactController::class)->only(['index', 'update', 'destroy']);
        
        // Settings
        Route::get('/settings', [SettingsController::class, 'index']);
        Route::post('/settings', [SettingsController::class, 'update']);
        
        // Standard user manager
        Route::apiResource('users', AdminUserController::class);
        Route::apiResource('roles', RoleController::class)->except(['show']);
    });
});
