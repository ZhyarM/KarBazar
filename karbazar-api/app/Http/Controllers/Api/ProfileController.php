<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    // Get user's own profile
    public function me(Request $request)
    {
        $profile = $request->user()->profile;

        return response()->json([
            'success' => true,
            'data' => new ProfileResource($profile->load('user')),
        ]);
    }

    // Get profile by username
    public function show($username)
    {
        $profile = Profile::where('username', $username)->with('user')->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => new ProfileResource($profile),
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
            'avatar_url' => 'nullable|url',
            'cover_url' => 'nullable|url',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url',
            'hourly_rate' => 'nullable|integer|min:0',
            'skills' => 'nullable|array',
            'languages' => 'nullable|array',
        ]);

        $profile->update($request->only([
            'username', 'bio', 'title', 'avatar_url', 'cover_url',
            'location', 'website', 'hourly_rate', 'skills', 'languages'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => new ProfileResource($profile->load('user')),
        ]);
    }

    // Get all freelancer profiles (for browsing)
    public function freelancers(Request $request)
    {
        $query = Profile::whereHas('user', function ($q) {
            $q->where('role', 'freelancer')->where('is_active', true);
        })->with('user');

        // Filters
        if ($request->has('skills')) {
            $skills = explode(',', $request->skills);
            $query->where(function ($q) use ($skills) {
                foreach ($skills as $skill) {
                    $q->orWhereJsonContains('skills', $skill);
                }
            });
        }

        if ($request->has('min_rating')) {
            $query->where('rating', '>=', $request->min_rating);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'rating');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $profiles = $query->paginate(12);

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
}