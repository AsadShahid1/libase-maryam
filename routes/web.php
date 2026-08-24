<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\PageController;
use App\Http\Controllers\Web\AdminPageController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| Web Routes — Laravel + Inertia.js
|--------------------------------------------------------------------------
*/

// ── Public Storefront Pages ──────────────────────────────────────────────
Route::get('/',          [PageController::class, 'home'])->name('home');
Route::get('/products',  [PageController::class, 'catalog'])->name('products');
Route::get('/product/{id}', [PageController::class, 'productDetail'])->name('product.show');
Route::get('/categories',[PageController::class, 'categories'])->name('categories');
Route::get('/about',     [PageController::class, 'about'])->name('about');
Route::get('/contact',   [PageController::class, 'contact'])->name('contact');
Route::get('/checkout',  [PageController::class, 'checkout'])->name('checkout');

// Contact form POST (JSON response, called via Axios from Contact page)
Route::post('/contact',  [ContactController::class, 'store'])->name('contact.store');

// ── Auth Routes ──────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login',    [PageController::class, 'login'])->name('login');
    Route::post('/login',   [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [PageController::class, 'register'])->name('register');
    Route::post('/register',[RegisteredUserController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// ── Authenticated User Pages ─────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [PageController::class, 'userDashboard'])->name('dashboard');
    Route::get('/profile',   [PageController::class, 'userProfile'])->name('profile');
});

// ── Admin Pages (auth + admin role) ─────────────────────────────────────
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/',               [AdminPageController::class, 'dashboard'])->name('dashboard');
    Route::get('/brands',         [AdminPageController::class, 'brands'])->name('brands');
    Route::get('/categories',     [AdminPageController::class, 'categories'])->name('categories');
    Route::get('/products',       [AdminPageController::class, 'products'])->name('products');
    Route::get('/banners',        [AdminPageController::class, 'banners'])->name('banners');
    Route::get('/administration', [AdminPageController::class, 'administration'])->name('administration');
    Route::get('/contacts',       [AdminPageController::class, 'contacts'])->name('contacts');
    Route::get('/settings',       [AdminPageController::class, 'settings'])->name('settings');
    Route::get('/users',          [AdminPageController::class, 'users'])->name('users');
    Route::get('/roles',          [AdminPageController::class, 'roles'])->name('roles');
});
