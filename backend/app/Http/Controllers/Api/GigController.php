<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GigResource;
use App\Http\Resources\GigDealResource;
use App\Models\Gig;
use App\Models\GigPackageDiscount;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GigController extends Controller
{
    // Get all gigs (with filters)
    public function index(Request $request)
    {
        $query = Gig::where('is_active', true)->with([
            'seller.profile',
            'category',
            'packageDiscounts' => function ($discountQuery) {
                $discountQuery->active();
            },
        ]);

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

    public function deals(Request $request)
    {
        $query = GigPackageDiscount::query()
            ->active()
            ->with(['gig.seller.profile', 'gig.category'])
            ->whereHas('gig', function ($gigQuery) {
                $gigQuery->where('is_active', true);
            });

        if ($request->filled('gig_id')) {
            $query->where('gig_id', $request->gig_id);
        }

        if ($request->filled('package_key')) {
            $query->where('package_key', $request->package_key);
        }

        if ($request->filled('category_id')) {
            $query->whereHas('gig', function ($gigQuery) use ($request) {
                $gigQuery->where('category_id', $request->category_id);
            });
        }

        if ($request->filled('discount_min')) {
            $query->where('discount_percentage', '>=', $request->discount_min);
        }

        if ($request->filled('discount_max')) {
            $query->where('discount_percentage', '<=', $request->discount_max);
        }

        if ($request->has('expiring_soon') && $request->expiring_soon == 'true') {
            $query->expiringSoon();
        }

        $query->orderByRaw('CASE WHEN expires_at IS NULL THEN 1 ELSE 0 END')
            ->orderBy('expires_at', 'asc')
            ->orderByDesc('discount_percentage');

        $deals = $query->paginate($request->integer('per_page', 12));

        return response()->json([
            'success' => true,
            'data' => GigDealResource::collection($deals),
            'meta' => [
                'current_page' => $deals->currentPage(),
                'last_page' => $deals->lastPage(),
                'per_page' => $deals->perPage(),
                'total' => $deals->total(),
            ],
        ]);
    }

    // Get single gig
    public function show(Request $request, $id)
    {
        $gig = Gig::with([
            'seller.profile',
            'category',
            'reviews.reviewer.profile',
            'packageDiscounts' => function ($discountQuery) {
                $discountQuery->active();
            },
        ])
            ->findOrFail($id);

        // Track view (once per user per gig, lifetime)
        $userId = null;
        if ($request->user()) {
            $userId = $request->user()->id;
        }

        $viewerIp = $request->ip();

        // Check if this user/ip already viewed this gig
        $existingView = DB::table('gig_views')
            ->where('gig_id', $gig->id)
            ->where(function ($query) use ($userId, $viewerIp) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('ip_address', $viewerIp);
                }
            })
            ->exists();

        if (!$existingView) {
            DB::table('gig_views')->insert([
                'gig_id' => $gig->id,
                'user_id' => $userId,
                'ip_address' => $viewerIp,
                'created_at' => now(),
            ]);
            $gig->increment('view_count');
        }

        return response()->json([
            'success' => true,
            'data' => new GigResource($gig),
        ]);
    }

    // Create gig (Freelancer/Business only)
    public function store(Request $request)
    {
        $allowedRoles = ['freelancer', 'business', 'admin'];
        if (!in_array($request->user()->role, $allowedRoles)) {
            return response()->json([
                'success' => false,
                'message' => 'Only business accounts can create gigs',
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'basic_price' => 'required|integer|min:5',
            'basic_delivery_time' => 'required|integer|min:1',
            'basic_description' => 'required|string',
            'standard_price' => 'nullable|integer|min:5',
            'standard_delivery_time' => 'nullable|integer|min:1',
            'standard_description' => 'nullable|string',
            'premium_price' => 'nullable|integer|min:5',
            'premium_delivery_time' => 'nullable|integer|min:1',
            'premium_description' => 'nullable|string',
            'image_url' => 'nullable|string',
            'gallery' => 'nullable|array',
            'tags' => 'nullable|array',
            'requirements' => 'nullable|string',
            'faqs' => 'nullable|array',
        ]);

        // Build packages JSON
        $packages = [
            'basic' => [
                'price' => $validated['basic_price'],
                'delivery_time' => $validated['basic_delivery_time'],
                'description' => $validated['basic_description'],
            ],
        ];

        if (!empty($validated['standard_price'])) {
            $packages['standard'] = [
                'price' => $validated['standard_price'],
                'delivery_time' => $validated['standard_delivery_time'],
                'description' => $validated['standard_description'] ?? '',
            ];
        }

        if (!empty($validated['premium_price'])) {
            $packages['premium'] = [
                'price' => $validated['premium_price'],
                'delivery_time' => $validated['premium_delivery_time'],
                'description' => $validated['premium_description'] ?? '',
            ];
        }

        $gig = Gig::create([
            'seller_id' => $request->user()->id,
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['basic_price'], // Starting price
            'delivery_time' => $validated['basic_delivery_time'], // Starting delivery time
            'image_url' => $validated['image_url'] ?? null,
            'gallery' => $validated['gallery'] ?? null,
            'tags' => $validated['tags'] ?? null,
            'packages' => $packages,
            'requirements' => $validated['requirements'] ?? null,
            'faq' => !empty($validated['faqs']) ? json_encode($validated['faqs']) : null,
            'is_active' => true, // New gigs are active by default
        ]);

        // Update category gig count
        $category = Category::find($validated['category_id']);
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

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'basic_price' => 'sometimes|integer|min:5',
            'basic_delivery_time' => 'sometimes|integer|min:1',
            'basic_description' => 'sometimes|string',
            'standard_price' => 'nullable|integer|min:5',
            'standard_delivery_time' => 'nullable|integer|min:1',
            'standard_description' => 'nullable|string',
            'premium_price' => 'nullable|integer|min:5',
            'premium_delivery_time' => 'nullable|integer|min:1',
            'premium_description' => 'nullable|string',
            'image_url' => 'nullable|string',
            'gallery' => 'nullable|array',
            'tags' => 'nullable|array',
            'requirements' => 'nullable|string',
            'faqs' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
            'is_trending' => 'sometimes|boolean',
        ]);

        // Build packages JSON if package data is provided
        $updateData = [];

        if (isset($validated['basic_price'])) {
            $packages = [
                'basic' => [
                    'price' => $validated['basic_price'],
                    'delivery_time' => $validated['basic_delivery_time'],
                    'description' => $validated['basic_description'],
                ],
            ];

            if (!empty($validated['standard_price'])) {
                $packages['standard'] = [
                    'price' => $validated['standard_price'],
                    'delivery_time' => $validated['standard_delivery_time'],
                    'description' => $validated['standard_description'] ?? '',
                ];
            }

            if (!empty($validated['premium_price'])) {
                $packages['premium'] = [
                    'price' => $validated['premium_price'],
                    'delivery_time' => $validated['premium_delivery_time'],
                    'description' => $validated['premium_description'] ?? '',
                ];
            }

            $updateData['packages'] = $packages;
            $updateData['price'] = $validated['basic_price'];
            $updateData['delivery_time'] = $validated['basic_delivery_time'];
        }

        // Add other fields
        foreach (['category_id', 'title', 'description', 'image_url', 'gallery', 'tags', 'requirements', 'is_active', 'is_featured', 'is_trending'] as $field) {
            if (isset($validated[$field])) {
                $updateData[$field] = $validated[$field];
            }
        }

        if (!empty($validated['faqs'])) {
            $updateData['faq'] = json_encode($validated['faqs']);
        }

        $gig->update($updateData);

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

    public function storeDiscount(Request $request)
    {
        $validated = $request->validate([
            'gig_id' => 'required|exists:gigs,id',
            'package_key' => 'required|string|in:basic,standard,premium',
            'discount_percentage' => 'required|numeric|min:1|max:100',
            'expires_at' => 'nullable|date',
            'is_active' => 'sometimes|boolean',
        ]);

        $gig = Gig::findOrFail($validated['gig_id']);
        if ($gig->seller_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $discount = GigPackageDiscount::create([
            'gig_id' => $gig->id,
            'package_key' => $validated['package_key'],
            'discount_percentage' => $validated['discount_percentage'],
            'expires_at' => $validated['expires_at'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Deal created successfully',
            'data' => new GigDealResource($discount->load(['gig.seller.profile', 'gig.category'])),
        ], 201);
    }

    public function updateDiscount(Request $request, $id)
    {
        $discount = GigPackageDiscount::with('gig')->findOrFail($id);

        if ($discount->gig->seller_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'discount_percentage' => 'sometimes|numeric|min:1|max:100',
            'expires_at' => 'nullable|date',
            'is_active' => 'sometimes|boolean',
        ]);

        $discount->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Deal updated successfully',
            'data' => new GigDealResource($discount->load(['gig.seller.profile', 'gig.category'])),
        ]);
    }

    public function destroyDiscount(Request $request, $id)
    {
        $discount = GigPackageDiscount::with('gig')->findOrFail($id);

        if ($discount->gig->seller_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $discount->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deal deleted successfully',
        ]);
    }
}
