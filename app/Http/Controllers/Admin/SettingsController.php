<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::pluck('value', 'key');
        return response()->json($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_name' => 'string|max:255',
            'company_tagline' => 'nullable|string|max:255',
            'company_logo' => 'nullable|string',
            'company_phone' => 'string|max:50',
            'company_email' => 'email|max:100',
            'company_address' => 'string',
            'social_facebook' => 'nullable|url',
            'social_instagram' => 'nullable|url',
            'social_whatsapp' => 'nullable|string',
            'about_us_title' => 'string|max:255',
            'about_us_content' => 'string',
            'payment_cod_enabled' => 'string|in:0,1',
            'payment_bank_enabled' => 'string|in:0,1',
            'payment_easypaisa_enabled' => 'string|in:0,1',
            'payment_jazzcash_enabled' => 'string|in:0,1',
            'payment_bank_details' => 'nullable|string',
            'payment_easypaisa_details' => 'nullable|string',
            'payment_jazzcash_details' => 'nullable|string'
        ]);

        foreach ($data as $key => $value) {
            Setting::setValue($key, $value);
        }

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => Setting::pluck('value', 'key')
        ]);
    }
}
