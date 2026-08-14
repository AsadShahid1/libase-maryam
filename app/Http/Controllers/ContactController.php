<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // Public: Store query
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:2000'
        ]);

        $msg = ContactMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'read_status' => false
        ]);

        return response()->json([
            'message' => 'Your message has been sent successfully. We will get back to you shortly!',
            'data' => $msg
        ], 201);
    }

    // Admin: List queries
    public function index(): JsonResponse
    {
        return response()->json(ContactMessage::latest()->get());
    }

    // Admin: Toggle read/unread status
    public function update(Request $request, ContactMessage $contact): JsonResponse
    {
        $contact->update([
            'read_status' => !$contact->read_status
        ]);
        return response()->json($contact);
    }

    // Admin: Delete query
    public function destroy(ContactMessage $contact): JsonResponse
    {
        $contact->delete();
        return response()->json(['message' => 'Inquiry deleted successfully']);
    }
}
