<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    // Upload profile picture
    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
        ]);

        $user = $request->user();
        
        // Delete old avatar if exists
        if ($user->profile->avatar_url) {
            $oldPath = str_replace('/storage/', '', $user->profile->avatar_url);
            Storage::disk('public')->delete($oldPath);
        }

        // Store new image
        $file = $request->file('image');
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('avatars', $filename, 'public');

        // Update profile
        $user->profile->update([
            'avatar_url' => '/storage/' . $path,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile picture uploaded successfully',
            'data' => [
                'avatar_url' => asset('storage/' . $path),
            ],
        ]);
    }

    // Upload cover photo
    public function uploadCoverPhoto(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:3072', // 3MB max
        ]);

        $user = $request->user();
        
        // Delete old cover if exists
        if ($user->profile->cover_url) {
            $oldPath = str_replace('/storage/', '', $user->profile->cover_url);
            Storage::disk('public')->delete($oldPath);
        }

        // Store new image
        $file = $request->file('image');
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('covers', $filename, 'public');

        // Update profile
        $user->profile->update([
            'cover_url' => '/storage/' . $path,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cover photo uploaded successfully',
            'data' => [
                'cover_url' => asset('storage/' . $path),
            ],
        ]);
    }

    // Upload gig image
    public function uploadGigImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $file = $request->file('image');
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('gigs', $filename, 'public');

        return response()->json([
            'success' => true,
            'message' => 'Gig image uploaded successfully',
            'data' => [
                'image_url' => asset('storage/' . $path),
            ],
        ]);
    }

    // Upload gig gallery (multiple images)
    public function uploadGigGallery(Request $request)
    {
        $request->validate([
            'images' => 'required|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $uploadedImages = [];

        foreach ($request->file('images') as $file) {
            $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('gigs/gallery', $filename, 'public');
            $uploadedImages[] = asset('storage/' . $path);
        }

        return response()->json([
            'success' => true,
            'message' => 'Gallery images uploaded successfully',
            'data' => [
                'images' => $uploadedImages,
            ],
        ]);
    }

    // Upload delivery files
    public function uploadDeliveryFiles(Request $request)
    {
        $request->validate([
            'files' => 'required|array|max:10',
            'files.*' => 'file|max:10240', // 10MB per file
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $originalName = $file->getClientOriginalName();
            $filename = Str::random(40) . '_' . $originalName;
            $path = $file->storeAs('deliveries', $filename, 'public');
            
            $uploadedFiles[] = [
                'name' => $originalName,
                'url' => asset('storage/' . $path),
                'size' => $file->getSize(),
                'type' => $file->getMimeType(),
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Delivery files uploaded successfully',
            'data' => [
                'files' => $uploadedFiles,
            ],
        ]);
    }

    // Upload message attachment
    public function uploadMessageAttachment(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:5120', // 5MB
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $filename = Str::random(40) . '_' . $originalName;
        $path = $file->storeAs('messages', $filename, 'public');

        return response()->json([
            'success' => true,
            'message' => 'File uploaded successfully',
            'data' => [
                'name' => $originalName,
                'url' => asset('storage/' . $path),
                'size' => $file->getSize(),
                'type' => $file->getMimeType(),
            ],
        ]);
    }

    // Delete file
    public function deleteFile(Request $request)
    {
        $request->validate([
            'file_url' => 'required|string',
        ]);

        $fileUrl = $request->file_url;
        $path = str_replace([asset('storage/'), '/storage/'], '', $fileUrl);

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            
            return response()->json([
                'success' => true,
                'message' => 'File deleted successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'File not found',
        ], 404);
    }
}