<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    // Get user's own profile
    public function me(Request $request)
    {
        $profile = $request->user()->profile;

        if (!$profile) {
            // Auto-create profile if it doesn't exist
            $profile = Profile::create([
                'user_id' => $request->user()->id,
                'username' => strtolower(str_replace(' ', '_', $request->user()->name)) . '_' . $request->user()->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => new ProfileResource($profile->load('user')),
        ]);
    }

    // Get profile by username (public view)
    public function show($username)
    {
        $profile = Profile::where('username', $username)
            ->with('user')
            ->firstOrFail();

        // Increment view count (only for public profiles)
        if ($profile->is_public) {
            $profile->incrementViews();
        }

        return response()->json([
            'success' => true,
            'data' => new ProfileResource($profile),
        ]);
    }

    // Get profile by user ID
    public function showById($userId)
    {
        $user = User::findOrFail($userId);
        $profile = $user->profile;

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found',
            ], 404);
        }

        if ($profile->is_public) {
            $profile->incrementViews();
        }

        return response()->json([
            'success' => true,
            'data' => new ProfileResource($profile->load('user')),
        ]);
    }

    // Update profile
    public function update(Request $request)
    {
        $profile = $request->user()->profile;

        $request->validate([
            'username' => 'sometimes|string|max:255|unique:profiles,username,' . $profile->id,
            'bio' => 'nullable|string',
            'title' => 'nullable|string|max:255',
            'avatar_url' => 'nullable|string',
            'cover_url' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'hourly_rate' => 'nullable|integer|min:0',
            'skills' => 'nullable|array',
            'languages' => 'nullable|array',
            'education' => 'nullable|array',
            'certifications' => 'nullable|array',
            'work_experience' => 'nullable|array',
            'portfolio' => 'nullable|array',
            'social_links' => 'nullable|array',
            'is_public' => 'nullable|boolean',
            'is_available' => 'nullable|boolean',
        ]);

        $profile->update($request->only([
            'username',
            'bio',
            'title',
            'avatar_url',
            'cover_url',
            'location',
            'website',
            'phone',
            'hourly_rate',
            'skills',
            'languages',
            'education',
            'certifications',
            'work_experience',
            'portfolio',
            'social_links',
            'is_public',
            'is_available'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => new ProfileResource($profile->load('user')),
        ]);
    }

    // Update specific section of profile
    public function updateSection(Request $request, $section)
    {
        $profile = $request->user()->profile;

        $validSections = [
            'basic' => ['username', 'bio', 'title', 'location', 'website', 'phone', 'hourly_rate'],
            'skills' => ['skills'],
            'languages' => ['languages'],
            'education' => ['education'],
            'certifications' => ['certifications'],
            'work_experience' => ['work_experience'],
            'portfolio' => ['portfolio'],
            'social_links' => ['social_links'],
            'privacy' => ['is_public'],
            'availability' => ['is_available'],
        ];

        if (!isset($validSections[$section])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid section',
            ], 400);
        }

        $profile->update($request->only($validSections[$section]));

        return response()->json([
            'success' => true,
            'message' => ucfirst($section) . ' updated successfully',
            'data' => new ProfileResource($profile->load('user')),
        ]);
    }

    // Get all freelancer profiles (for browsing)
    public function freelancers(Request $request)
    {
        $query = Profile::whereHas('user', function ($q) {
            $q->where('role', 'freelancer')->where('is_active', true);
        })->where('is_public', true)->with('user');

        // Search by name, username, or title
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('bio', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by skills
        if ($request->has('skills')) {
            $skills = is_array($request->skills) ? $request->skills : explode(',', $request->skills);
            $query->where(function ($q) use ($skills) {
                foreach ($skills as $skill) {
                    $q->orWhereJsonContains('skills', trim($skill));
                }
            });
        }

        // Filter by location
        if ($request->has('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Filter by minimum rating
        if ($request->has('min_rating')) {
            $query->where('rating', '>=', $request->min_rating);
        }

        // Filter by hourly rate range
        if ($request->has('min_rate')) {
            $query->where('hourly_rate', '>=', $request->min_rate);
        }
        if ($request->has('max_rate')) {
            $query->where('hourly_rate', '<=', $request->max_rate);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'rating');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSorts = ['rating', 'total_reviews', 'total_jobs', 'hourly_rate', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $profiles = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'success' => true,
            'data' => ProfileResource::collection($profiles),
            'meta' => [
                'current_page' => $profiles->currentPage(),
                'last_page' => $profiles->lastPage(),
                'per_page' => $profiles->perPage(),
                'total' => $profiles->total(),
            ],
        ]);
    }

    // Get profile statistics
    public function statistics(Request $request)
    {
        $profile = $request->user()->profile;

        return response()->json([
            'success' => true,
            'data' => [
                'rating' => (float) $profile->rating,
                'total_reviews' => $profile->total_reviews,
                'total_jobs' => $profile->total_jobs,
                'total_earnings' => $profile->total_earnings,
                'response_time' => $profile->response_time,
                'profile_views' => $profile->profile_views,
                'gigs_count' => $profile->gigs_count,
            ],
        ]);
    }
}
