<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GigResource;
use App\Http\Resources\UserResource;
use App\Models\Favorite;
use App\Models\Gig;
use App\Models\User;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    // Get user's favorite gigs
    public function favoriteGigs(Request $request)
    {
        $gigs = $request->user()
            ->favoriteGigs()
            ->with(['seller.profile', 'category'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => GigResource::collection($gigs),
        ]);
    }

    // Get user's favorite freelancers
    public function favoriteFreelancers(Request $request)
    {
        $freelancers = $request->user()
            ->favoriteFreelancers()
            ->with('profile')
            ->get();

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($freelancers),
        ]);
    }

    // Toggle favorite gig
    public function toggleGigFavorite(Request $request, $gigId)
    {
        $gig = Gig::findOrFail($gigId);

        $favorite = Favorite::where([
            'user_id' => $request->user()->id,
            'favoritable_type' => Gig::class,
            'favoritable_id' => $gigId,
        ])->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'success' => true,
                'message' => 'Gig removed from favorites',
                'is_favorited' => false,
            ]);
        } else {
            Favorite::create([
                'user_id' => $request->user()->id,
                'favoritable_type' => Gig::class,
                'favoritable_id' => $gigId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Gig added to favorites',
                'is_favorited' => true,
            ]);
        }
    }

    // Toggle favorite freelancer
    public function toggleFreelancerFavorite(Request $request, $userId)
    {
        $freelancer = User::where('role', 'freelancer')->findOrFail($userId);

        $favorite = Favorite::where([
            'user_id' => $request->user()->id,
            'favoritable_type' => User::class,
            'favoritable_id' => $userId,
        ])->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'success' => true,
                'message' => 'Freelancer removed from favorites',
                'is_favorited' => false,
            ]);
        } else {
            Favorite::create([
                'user_id' => $request->user()->id,
                'favoritable_type' => User::class,
                'favoritable_id' => $userId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Freelancer added to favorites',
                'is_favorited' => true,
            ]);
        }
    }

    // Check if gig is favorited
    public function checkGigFavorite(Request $request, $gigId)
    {
        $isFavorited = Favorite::where([
            'user_id' => $request->user()->id,
            'favoritable_type' => Gig::class,
            'favoritable_id' => $gigId,
        ])->exists();

        return response()->json([
            'success' => true,
            'is_favorited' => $isFavorited,
        ]);
    }

    // Check if freelancer is favorited
    public function checkFreelancerFavorite(Request $request, $userId)
    {
        $isFavorited = Favorite::where([
            'user_id' => $request->user()->id,
            'favoritable_type' => User::class,
            'favoritable_id' => $userId,
        ])->exists();

        return response()->json([
            'success' => true,
            'is_favorited' => $isFavorited,
        ]);
    }
}