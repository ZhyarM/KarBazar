<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdRequestResource;
use App\Models\AdRequest;
use App\Mail\AdRequestReceived;
use App\Mail\AdApproved;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AdRequestController extends Controller
{
    // Get all ad requests (Admin only)
    public function index(Request $request)
    {
        $query = AdRequest::orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $adRequests = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => AdRequestResource::collection($adRequests),
            'meta' => [
                'current_page' => $adRequests->currentPage(),
                'last_page' => $adRequests->lastPage(),
                'per_page' => $adRequests->perPage(),
                'total' => $adRequests->total(),
            ],
        ]);
    }

    // Create ad request (Public)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'company_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
            'budget' => 'nullable|numeric|min:0',
            'ad_type' => 'required|in:image,video',
            'duration_days' => 'required|integer|min:1|max:365',
        ]);

        $adRequest = AdRequest::create($request->all());

        // Send email notification to admin
        Mail::to(config('mail.from.address'))->send(new AdRequestReceived($adRequest));

        return response()->json([
            'success' => true,
            'message' => 'Ad request submitted successfully. We will contact you soon!',
            'data' => new AdRequestResource($adRequest),
        ], 201);
    }

    // Update ad request status (Admin only)
    public function updateStatus(Request $request, $id)
    {
        $adRequest = AdRequest::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $adRequest->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ]);

        // Send email to requester if approved or rejected
        if ($request->status === 'approved') {
            Mail::to($adRequest->email)->send(new AdApproved($adRequest));
        }

        return response()->json([
            'success' => true,
            'message' => 'Ad request status updated successfully',
            'data' => new AdRequestResource($adRequest),
        ]);
    }

    // Delete ad request (Admin only)
    public function destroy($id)
    {
        $adRequest = AdRequest::findOrFail($id);
        $adRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ad request deleted successfully',
        ]);
    }
}