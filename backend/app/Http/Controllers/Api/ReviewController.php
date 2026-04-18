<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Models\Order;
use App\Models\Gig;
use App\Models\Notification;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // Get all reviews for a gig
    public function gigReviews($gigId)
    {
        $reviews = Review::where('gig_id', $gigId)
            ->with(['reviewer.profile', 'order'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => ReviewResource::collection($reviews),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    // Get reviews received by a user (freelancer)
    public function userReviews($userId)
    {
        $reviews = Review::where('reviewee_id', $userId)
            ->with(['reviewer.profile', 'gig', 'order'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => ReviewResource::collection($reviews),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    // Create review
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $order = Order::findOrFail($request->order_id);

        // Check if user is the buyer
        if ($order->buyer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Only the buyer can review this order',
            ], 403);
        }

        // Check if order is completed
        if ($order->status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Order must be completed before reviewing',
            ], 400);
        }

        // Check if review already exists
        if (Review::where('order_id', $order->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Review already exists for this order',
            ], 400);
        }

        $review = Review::create([
            'order_id' => $order->id,
            'gig_id' => $order->gig_id,
            'reviewer_id' => $request->user()->id,
            'reviewee_id' => $order->seller_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Update gig rating and review count
        $gig = Gig::find($order->gig_id);
        $gig->increment('review_count');
        
        $avgRating = Review::where('gig_id', $gig->id)->avg('rating');
        $gig->update(['rating' => round($avgRating, 2)]);

        // Update seller profile rating
        $sellerProfile = $order->seller->profile;
        $sellerProfile->increment('total_reviews');
        
        $avgSellerRating = Review::where('reviewee_id', $order->seller_id)->avg('rating');
        $sellerProfile->update(['rating' => round($avgSellerRating, 2)]);

        // Create notification
        Notification::create([
            'user_id' => $order->seller_id,
            'type' => 'review',
            'title' => 'New Review Received',
            'message' => 'You received a ' . $request->rating . ' star review',
            'link' => '/gigs/' . $order->gig_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully',
            'data' => new ReviewResource($review->load(['reviewer.profile', 'gig'])),
        ], 201);
    }

    // Update review
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        // Check ownership
        if ($review->reviewer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $oldRating = $review->rating;
        $review->update($request->only(['rating', 'comment']));

        // Update gig rating if rating changed
        if ($request->has('rating') && $oldRating != $request->rating) {
            $gig = Gig::find($review->gig_id);
            $avgRating = Review::where('gig_id', $gig->id)->avg('rating');
            $gig->update(['rating' => round($avgRating, 2)]);

            // Update seller profile rating
            $avgSellerRating = Review::where('reviewee_id', $review->reviewee_id)->avg('rating');
            $review->reviewee->profile->update(['rating' => round($avgSellerRating, 2)]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully',
            'data' => new ReviewResource($review->load(['reviewer.profile', 'gig'])),
        ]);
    }

    // Delete review
    public function destroy(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        // Check ownership or admin
        if ($review->reviewer_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Update gig stats
        $gig = Gig::find($review->gig_id);
        $gig->decrement('review_count');
        
        // Recalculate average rating
        $avgRating = Review::where('gig_id', $gig->id)
            ->where('id', '!=', $review->id)
            ->avg('rating');
        $gig->update(['rating' => $avgRating ? round($avgRating, 2) : 0]);

        // Update seller profile stats
        $sellerProfile = $review->reviewee->profile;
        $sellerProfile->decrement('total_reviews');
        
        $avgSellerRating = Review::where('reviewee_id', $review->reviewee_id)
            ->where('id', '!=', $review->id)
            ->avg('rating');
        $sellerProfile->update(['rating' => $avgSellerRating ? round($avgSellerRating, 2) : 0]);

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully',
        ]);
    }
}