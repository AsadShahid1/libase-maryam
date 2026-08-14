<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdministrationController extends Controller
{
    public function index(): JsonResponse
    {
        // Get all staff and administrators (all users with roles)
        $admins = User::with('roles')->whereHas('roles', function($q) {
            $q->whereIn('name', ['admin', 'user']);
        })->latest()->get();

        return response()->json($admins);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:admin,user'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $user->assignRole($request->role);

        return response()->json($user->load('roles'), 201);
    }

    public function update(Request $request, User $administration): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|max:255|unique:users,email,{$administration->id}",
            'password' => 'nullable|string|min:6',
            'role' => 'required|string|in:admin,user'
        ]);

        $administration->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->filled('password')) {
            $administration->update([
                'password' => Hash::make($request->password)
            ]);
        }

        $administration->syncRoles([$request->role]);

        return response()->json($administration->load('roles'));
    }

    public function destroy(User $administration): JsonResponse
    {
        // Prevent deleting oneself
        if (auth()->id() === $administration->id) {
            return response()->json(['message' => 'Cannot delete yourself'], 422);
        }

        $administration->delete();
        return response()->json(['message' => 'Administrator/Staff deleted successfully']);
    }
}
