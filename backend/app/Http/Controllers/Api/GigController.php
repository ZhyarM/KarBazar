<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GigResource;
use App\Models\Gig;
use App\Models\Category;
use Illuminate\Http\Request;

class GigController extends Controller
{
    // Get all gigs (with filters)
    public function index(Request $request)
    {
        $query = Gig::where('is_active', true)->with(['seller.profile', 'category']);

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Delivery time
        if ($request->has('max_delivery_time')) {
            $query->where('delivery_time', '<=', $request->max_delivery_time);
        }

        // Rating
        if ($request->has('min_rating')) {
            $query->where('rating', '>=', $request->min_rating);
        }

        // Featured/Trending
        if ($request->has('featured') && $request->featured == 'true') {
            $query->where('is_featured', true);
        }
        if ($request->has('trending') && $request->trending == 'true') {
            $query->where('is_trending', true);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if ($sortBy == 'relevance' && $request->has('search')) {
            // Custom relevance sorting could be implemented here
            $query->orderBy('rating', 'desc')->orderBy('order_count', 'desc');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $gigs = $query->paginate(12);

        return response()->json([
            'success' => true,
            'data' => GigResource::collection($gigs),
            'meta' => [
                'current_page' => $gigs->currentPage(),
                'last_page' => $gigs->lastPage(),
                'per_page' => $gigs->perPage(),
                'total' => $gigs->total(),
            ],
        ]);
    }

    // Get single gig
    public function show($id)
    {
        $gig = Gig::with(['seller.profile', 'category', 'reviews.reviewer.profile'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new GigResource($gig),
        ]);
    }

    // Create gig (Freelancer only)
    public function store(Request $request)
    {
        if ($request->user()->role !== 'freelancer' && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only freelancers can create gigs',
            ], 403);
        }

        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|integer|min:5',
            'delivery_time' => 'required|integer|min:1',
            'image_url' => 'nullable|url',
            'gallery' => 'nullable|array',
            'tags' => 'nullable|array',
            'packages' => 'nullable|array',
            'requirements' => 'nullable|string',
            'faq' => 'nullable|string',
        ]);

        $gig = Gig::create([
            'seller_id' => $request->user()->id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'delivery_time' => $request->delivery_time,
            'image_url' => $request->image_url,
            'gallery' => $request->gallery,
            'tags' => $request->tags,
            'packages' => $request->packages,
            'requirements' => $request->requirements,
            'faq' => $request->faq,
        ]);

        // Update category gig count
        $category = Category::find($request->category_id);
        $category->increment('gig_count');

        return response()->json([
            'success' => true,
            'message' => 'Gig created successfully',
            'data' => new GigResource($gig->load(['seller.profile', 'category'])),
        ], 201);
    }

    // Update gig
    public function update(Request $request, $id)
    {
        $gig = Gig::findOrFail($id);

        // Check ownership
        if ($gig->seller_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|integer|min:5',
            'delivery_time' => 'sometimes|integer|min:1',
            'image_url' => 'nullable|url',
            'gallery' => 'nullable|array',
            'tags' => 'nullable|array',
            'packages' => 'nullable|array',
            'requirements' => 'nullable|string',
            'faq' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $gig->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Gig updated successfully',
            'data' => new GigResource($gig->load(['seller.profile', 'category'])),
        ]);
    }

    // Delete gig
    public function destroy(Request $request, $id)
    {
        $gig = Gig::findOrFail($id);

        // Check ownership
        if ($gig->seller_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Update category gig count
        $category = Category::find($gig->category_id);
        $category->decrement('gig_count');

        $gig->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gig deleted successfully',
        ]);
    }

    // Get seller's gigs
    public function myGigs(Request $request)
    {
        $gigs = Gig::where('seller_id', $request->user()->id)
            ->with(['category', 'reviews'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => GigResource::collection($gigs),
        ]);
    }
}