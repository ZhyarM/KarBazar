<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Follow;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    // Follow / Unfollow a user
    public function toggle(Request $request, $userId)
    {
        $user = $request->user();
        $targetUser = User::findOrFail($userId);

        // Cannot follow yourself
        if ($user->id === $targetUser->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot follow yourself',
            ], 400);
        }

        $existing = Follow::where('follower_id', $user->id)
            ->where('following_id', $targetUser->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'success' => true,
                'message' => 'Unfollowed successfully',
                'data' => [
                    'is_following' => false,
                    'followers_count' => $targetUser->followersCount(),
                ],
            ]);
        }

        Follow::create([
            'follower_id' => $user->id,
            'following_id' => $targetUser->id,
        ]);

        // Send notification
        Notification::create([
            'user_id' => $targetUser->id,
            'type' => 'new_follower',
            'title' => 'New Follower',
            'message' => $user->name . ' started following you',
            'link' => '/profile/' . ($user->profile->username ?? $user->id),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Followed successfully',
            'data' => [
                'is_following' => true,
                'followers_count' => $targetUser->followersCount(),
            ],
        ]);
    }

    // Check if following
    public function check(Request $request, $userId)
    {
        $user = $request->user();

        $isFollowing = Follow::where('follower_id', $user->id)
            ->where('following_id', $userId)
            ->exists();

        return response()->json([
            'success' => true,
            'data' => [
                'is_following' => $isFollowing,
            ],
        ]);
    }

    // Get followers of a user
    public function followers(Request $request, $userId)
    {
        $targetUser = User::findOrFail($userId);

        $followers = Follow::where('following_id', $userId)
            ->with('follower.profile')
            ->paginate(20);

        $followersData = $followers->getCollection()->map(function ($follow) use ($request) {
            $user = $request->user();
            $isFollowing = false;
            if ($user) {
                $isFollowing = Follow::where('follower_id', $user->id)
                    ->where('following_id', $follow->follower->id)
                    ->exists();
            }

            return [
                'id' => $follow->follower->id,
                'name' => $follow->follower->name,
                'role' => $follow->follower->role,
                'profile' => $follow->follower->profile ? [
                    'username' => $follow->follower->profile->username,
                    'avatar_url' => $follow->follower->profile->avatar_url,
                    'title' => $follow->follower->profile->title,
                ] : null,
                'is_following' => $isFollowing,
                'followed_at' => $follow->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $followersData,
            'meta' => [
                'current_page' => $followers->currentPage(),
                'last_page' => $followers->lastPage(),
                'per_page' => $followers->perPage(),
                'total' => $followers->total(),
                'followers_count' => $targetUser->followersCount(),
                'following_count' => $targetUser->followingCount(),
            ],
        ]);
    }

    // Get users that a user is following
    public function following(Request $request, $userId)
    {
        $targetUser = User::findOrFail($userId);

        $following = Follow::where('follower_id', $userId)
            ->with('following.profile')
            ->paginate(20);

        $followingData = $following->getCollection()->map(function ($follow) use ($request) {
            $user = $request->user();
            $isFollowing = false;
            if ($user) {
                $isFollowing = Follow::where('follower_id', $user->id)
                    ->where('following_id', $follow->following->id)
                    ->exists();
            }

            return [
                'id' => $follow->following->id,
                'name' => $follow->following->name,
                'role' => $follow->following->role,
                'profile' => $follow->following->profile ? [
                    'username' => $follow->following->profile->username,
                    'avatar_url' => $follow->following->profile->avatar_url,
                    'title' => $follow->following->profile->title,
                ] : null,
                'is_following' => $isFollowing,
                'followed_at' => $follow->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $followingData,
            'meta' => [
                'current_page' => $following->currentPage(),
                'last_page' => $following->lastPage(),
                'per_page' => $following->perPage(),
                'total' => $following->total(),
                'followers_count' => $targetUser->followersCount(),
                'following_count' => $targetUser->followingCount(),
            ],
        ]);
    }

    // Get follow stats for a user
    public function stats(Request $request, $userId)
    {
        $targetUser = User::findOrFail($userId);

        $user = $request->user();
        $isFollowing = false;
        if ($user && $user->id !== $targetUser->id) {
            $isFollowing = Follow::where('follower_id', $user->id)
                ->where('following_id', $targetUser->id)
                ->exists();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'followers_count' => $targetUser->followersCount(),
                'following_count' => $targetUser->followingCount(),
                'is_following' => $isFollowing,
            ],
        ]);
    }
}
