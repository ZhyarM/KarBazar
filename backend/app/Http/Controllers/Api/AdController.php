<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdvertisementResource;
use App\Models\Advertisement;
use App\Models\Setting;
use Illuminate\Http\Request;

class AdController extends Controller
{
    // Get all advertisements (Admin only)
    public function index(Request $request)
    {
        $query = Advertisement::with('user.profile')->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $ads = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => AdvertisementResource::collection($ads),
            'meta' => [
                'current_page' => $ads->currentPage(),
                'last_page' => $ads->lastPage(),
                'per_page' => $ads->perPage(),
                'total' => $ads->total(),
            ],
        ]);
    }

    // Get active advertisements (Public)
    public function getActiveAds()
    {
        $ads = Advertisement::active()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => AdvertisementResource::collection($ads),
        ]);
    }

    // Get user's own advertisements
    public function myAds(Request $request)
    {
        $ads = Advertisement::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => AdvertisementResource::collection($ads),
        ]);
    }

    // Create advertisement (Admin only)
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:image,video',
            'media_url' => 'required|url',
            'link_url' => 'nullable|url',
            'duration' => 'nullable|integer|min:5|max:60',
            'paid_amount' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => 'nullable|in:pending,active,expired,rejected',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $ad = Advertisement::create([
            'user_id' => $request->user_id,
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'media_url' => $request->media_url,
            'link_url' => $request->link_url,
            'duration' => $request->duration ?? Setting::getAdDisplayDuration(),
            'paid_amount' => $request->paid_amount,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => $request->status ?? 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Advertisement created successfully',
            'data' => new AdvertisementResource($ad->load('user.profile')),
        ], 201);
    }

    // Purchase advertisement (Authenticated users)
    public function purchaseAd(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:image,video',
            'media_url' => 'required|url',
            'link_url' => 'nullable|url',
            'duration' => 'nullable|integer|min:5|max:60',
            'paid_amount' => 'required|numeric|min:' . Setting::getMinAdPrice(),
            'duration_days' => 'required|integer|min:1|max:365',
        ]);

        $startDate = now();
        $endDate = now()->addDays($request->duration_days);

        $ad = Advertisement::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'media_url' => $request->media_url,
            'link_url' => $request->link_url,
            'duration' => $request->duration ?? Setting::getAdDisplayDuration(),
            'paid_amount' => $request->paid_amount,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'pending', // Needs admin approval
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Advertisement purchased successfully. Waiting for admin approval.',
            'data' => new AdvertisementResource($ad->load('user.profile')),
        ], 201);
    }

    // Update advertisement (Admin only)
    public function update(Request $request, $id)
    {
        $ad = Advertisement::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:image,video',
            'media_url' => 'sometimes|url',
            'link_url' => 'nullable|url',
            'duration' => 'nullable|integer|min:5|max:60',
            'paid_amount' => 'sometimes|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => 'sometimes|in:pending,active,expired,rejected',
        ]);

        $ad->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Advertisement updated successfully',
            'data' => new AdvertisementResource($ad->load('user.profile')),
        ]);
    }

    // Update advertisement status (Admin only)
    public function updateStatus(Request $request, $id)
    {
        $ad = Advertisement::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,active,expired,rejected',
        ]);

        $ad->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Advertisement status updated successfully',
            'data' => new AdvertisementResource($ad->load('user.profile')),
        ]);
    }

    // Delete advertisement (Admin only)
    public function destroy($id)
    {
        $ad = Advertisement::findOrFail($id);
        $ad->delete();

        return response()->json([
            'success' => true,
            'message' => 'Advertisement deleted successfully',
        ]);
    }

    // Track ad view (Public)
    public function trackView($id)
    {
        $ad = Advertisement::findOrFail($id);
        $ad->incrementImpressions();

        return response()->json([
            'success' => true,
            'message' => 'View tracked',
        ]);
    }

    // Track ad click (Public)
    public function trackClick($id)
    {
        $ad = Advertisement::findOrFail($id);
        $ad->incrementClicks();

        return response()->json([
            'success' => true,
            'message' => 'Click tracked',
        ]);
    }
}