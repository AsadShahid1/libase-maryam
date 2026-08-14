<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles', 'permissions');

        return response()->json([
            'user'        => $user,
            'roles'       => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'message'     => "Welcome back, {$user->name}!",
        ]);
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json($request->user()->load('roles'));
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => "sometimes|email|unique:users,email,{$request->user()->id}",
        ]);

        $request->user()->update($request->only('name', 'email'));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $request->user()->fresh()->load('roles'),
        ]);
    }
}
