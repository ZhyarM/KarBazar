<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostLike;
use App\Models\PostComment;
use App\Models\PostBookmark;
use App\Models\Notification;
use App\Models\Follow;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // Get post feed (smart algorithm)
    public function feed(Request $request)
    {
        $user = auth('sanctum')->user();
        $page = $request->get('page', 1);
        $perPage = $request->get('per_page', 10);

        if (!$user) {
            // Public feed: trending posts
            return $this->publicFeed($request);
        }

        // Get IDs of freelancers user follows
        $followingIds = Follow::where('follower_id', $user->id)->pluck('following_id')->toArray();

        // Get categories/tags user has interacted with (liked or commented)
        $interactedPostIds = PostLike::where('user_id', $user->id)->pluck('post_id')
            ->merge(PostComment::where('user_id', $user->id)->pluck('post_id'))
            ->unique();

        $interactedCategories = Post::whereIn('id', $interactedPostIds)
            ->whereNotNull('category_id')
            ->pluck('category_id')
            ->unique()
            ->toArray();

        $interactedTags = Post::whereIn('id', $interactedPostIds)
            ->whereNotNull('tags')
            ->pluck('tags')
            ->flatten()
            ->unique()
            ->toArray();

        // Build the feed with priority scoring
        $query = Post::where('is_active', true)
            ->with(['user.profile', 'category']);

        // Use raw SQL for priority scoring
        $followedIds = implode(',', array_merge($followingIds, [0])); // add 0 to prevent empty IN clause
        $categoryIds = implode(',', array_merge($interactedCategories, [0]));

        $posts = Post::where('is_active', true)
            ->with(['user.profile', 'category'])
            ->selectRaw("posts.*, 
                CASE 
                    WHEN user_id IN ({$followedIds}) THEN 30
                    ELSE 0 
                END +
                CASE 
                    WHEN category_id IN ({$categoryIds}) THEN 15
                    ELSE 0 
                END +
                (likes_count * 2) +
                (comments_count * 3) +
                CASE 
                    WHEN created_at >= NOW() - INTERVAL 7 DAY THEN 10
                    WHEN created_at >= NOW() - INTERVAL 30 DAY THEN 5
                    ELSE 0
                END as priority_score
            ")
            ->orderByDesc('priority_score')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        // Attach user-specific data
        $postsData = $posts->getCollection()->map(function ($post) use ($user) {
            return $this->formatPost($post, $user);
        });

        return response()->json([
            'success' => true,
            'data' => $postsData,
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    // Public feed (no auth)
    public function publicFeed(Request $request)
    {
        $perPage = $request->get('per_page', 10);

        $posts = Post::where('is_active', true)
            ->with(['user.profile', 'category'])
            ->selectRaw("posts.*, 
                (likes_count * 2) + (comments_count * 3) +
                CASE 
                    WHEN created_at >= NOW() - INTERVAL 7 DAY THEN 10
                    WHEN created_at >= NOW() - INTERVAL 30 DAY THEN 5
                    ELSE 0
                END as priority_score
            ")
            ->orderByDesc('priority_score')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        $postsData = $posts->getCollection()->map(function ($post) {
            return $this->formatPost($post, null);
        });

        return response()->json([
            'success' => true,
            'data' => $postsData,
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    // Get all posts (browseable)
    public function index(Request $request)
    {
        $query = Post::where('is_active', true)->with(['user.profile', 'category']);

        // Search by tags
        if ($request->has('tag')) {
            $tag = $request->tag;
            $query->whereJsonContains('tags', $tag);
        }

        // Search by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search in title/description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if ($sortBy === 'popular') {
            $query->orderByDesc('likes_count')->orderByDesc('comments_count');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $perPage = $request->get('per_page', 10);
        $posts = $query->paginate($perPage);

        $user = $request->user();
        $postsData = $posts->getCollection()->map(function ($post) use ($user) {
            return $this->formatPost($post, $user);
        });

        return response()->json([
            'success' => true,
            'data' => $postsData,
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    // Get single post
    public function show(Request $request, $id)
    {
        $post = Post::with(['user.profile', 'category', 'comments.user.profile', 'comments.replies.user.profile'])
            ->findOrFail($id);

        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => $this->formatPost($post, $user),
        ]);
    }

    // Create post (Freelancer only)
    public function store(Request $request)
    {
        $allowedRoles = ['freelancer', 'business', 'admin'];
        if (!in_array($request->user()->role, $allowedRoles)) {
            return response()->json([
                'success' => false,
                'message' => 'Only freelancer accounts can create posts',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'images' => 'nullable|array',
            'images.*' => 'string',
        ]);

        $post = Post::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'] ?? null,
            'tags' => $validated['tags'] ?? null,
            'images' => $validated['images'] ?? null,
        ]);

        $post->load(['user.profile', 'category']);

        return response()->json([
            'success' => true,
            'message' => 'Post created successfully',
            'data' => $this->formatPost($post, $request->user()),
        ], 201);
    }

    // Update post
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'is_active' => 'sometimes|boolean',
        ]);

        $post->update($validated);
        $post->load(['user.profile', 'category']);

        return response()->json([
            'success' => true,
            'message' => 'Post updated successfully',
            'data' => $this->formatPost($post, $request->user()),
        ]);
    }

    // Delete post
    public function destroy(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Post deleted successfully',
        ]);
    }

    // Get my posts
    public function myPosts(Request $request)
    {
        $posts = Post::where('user_id', $request->user()->id)
            ->with(['category'])
            ->orderByDesc('created_at')
            ->get();

        $postsData = $posts->map(function ($post) use ($request) {
            return $this->formatPost($post, $request->user());
        });

        return response()->json([
            'success' => true,
            'data' => $postsData,
        ]);
    }

    // Get posts by user
    public function userPosts(Request $request, $userId)
    {
        $posts = Post::where('user_id', $userId)
            ->where('is_active', true)
            ->with(['user.profile', 'category'])
            ->orderByDesc('created_at')
            ->paginate(10);

        $user = $request->user();
        $postsData = $posts->getCollection()->map(function ($post) use ($user) {
            return $this->formatPost($post, $user);
        });

        return response()->json([
            'success' => true,
            'data' => $postsData,
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    // Like / Unlike a post
    public function toggleLike(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $user = $request->user();

        $existing = PostLike::where('user_id', $user->id)->where('post_id', $id)->first();

        if ($existing) {
            $existing->delete();
            $post->decrement('likes_count');
            return response()->json([
                'success' => true,
                'message' => 'Post unliked',
                'data' => ['is_liked' => false, 'likes_count' => $post->fresh()->likes_count],
            ]);
        }

        PostLike::create([
            'user_id' => $user->id,
            'post_id' => $id,
        ]);
        $post->increment('likes_count');

        // Notify post owner
        if ($post->user_id !== $user->id) {
            Notification::create([
                'user_id' => $post->user_id,
                'type' => 'post_like',
                'title' => 'New Like',
                'message' => $user->name . ' liked your post "' . $post->title . '"',
                'link' => '/posts/' . $post->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Post liked',
            'data' => ['is_liked' => true, 'likes_count' => $post->fresh()->likes_count],
        ]);
    }

    // Add comment
    public function addComment(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $user = $request->user();

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:post_comments,id',
        ]);

        $comment = PostComment::create([
            'user_id' => $user->id,
            'post_id' => $id,
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        $post->increment('comments_count');
        $comment->load('user.profile');

        // Notify post owner
        if ($post->user_id !== $user->id) {
            Notification::create([
                'user_id' => $post->user_id,
                'type' => 'post_comment',
                'title' => 'New Comment',
                'message' => $user->name . ' commented on your post "' . $post->title . '"',
                'link' => '/posts/' . $post->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Comment added',
            'data' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'parent_id' => $comment->parent_id,
                'created_at' => $comment->created_at,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                    'avatar_url' => $comment->user->profile->avatar_url ?? null,
                ],
            ],
        ]);
    }

    // Get comments for a post
    public function getComments(Request $request, $id)
    {
        $comments = PostComment::where('post_id', $id)
            ->whereNull('parent_id')
            ->with(['user.profile', 'replies.user.profile'])
            ->orderByDesc('created_at')
            ->paginate(20);

        $commentsData = $comments->getCollection()->map(function ($comment) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                    'avatar_url' => $comment->user->profile->avatar_url ?? null,
                ],
                'replies' => $comment->replies->map(function ($reply) {
                    return [
                        'id' => $reply->id,
                        'content' => $reply->content,
                        'created_at' => $reply->created_at,
                        'user' => [
                            'id' => $reply->user->id,
                            'name' => $reply->user->name,
                            'avatar_url' => $reply->user->profile->avatar_url ?? null,
                        ],
                    ];
                }),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $commentsData,
            'meta' => [
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'per_page' => $comments->perPage(),
                'total' => $comments->total(),
            ],
        ]);
    }

    // Delete comment
    public function deleteComment(Request $request, $postId, $commentId)
    {
        $comment = PostComment::where('post_id', $postId)->findOrFail($commentId);

        if ($comment->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $post = Post::find($postId);
        if ($post) {
            // Count this comment + its replies
            $replyCount = $comment->replies()->count();
            $post->decrement('comments_count', 1 + $replyCount);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted',
        ]);
    }

    // Toggle bookmark
    public function toggleBookmark(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $user = $request->user();

        $existing = PostBookmark::where('user_id', $user->id)->where('post_id', $id)->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'success' => true,
                'message' => 'Bookmark removed',
                'data' => ['is_bookmarked' => false],
            ]);
        }

        PostBookmark::create([
            'user_id' => $user->id,
            'post_id' => $id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Post bookmarked',
            'data' => ['is_bookmarked' => true],
        ]);
    }

    // Get bookmarked posts
    public function bookmarkedPosts(Request $request)
    {
        $user = $request->user();

        $postIds = PostBookmark::where('user_id', $user->id)->pluck('post_id');

        $posts = Post::whereIn('id', $postIds)
            ->where('is_active', true)
            ->with(['user.profile', 'category'])
            ->orderByDesc('created_at')
            ->paginate(10);

        $postsData = $posts->getCollection()->map(function ($post) use ($user) {
            return $this->formatPost($post, $user);
        });

        return response()->json([
            'success' => true,
            'data' => $postsData,
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    // Helper: Format post data
    private function formatPost($post, $user)
    {
        $isFollowing = false;
        $isLiked = false;
        $isBookmarked = false;

        if ($user) {
            $isLiked = PostLike::where('user_id', $user->id)->where('post_id', $post->id)->exists();
            $isBookmarked = PostBookmark::where('user_id', $user->id)->where('post_id', $post->id)->exists();
            if ($post->user_id !== $user->id) {
                $isFollowing = Follow::where('follower_id', $user->id)->where('following_id', $post->user_id)->exists();
            }
        }

        return [
            'id' => $post->id,
            'title' => $post->title,
            'description' => $post->description,
            'tags' => $post->tags,
            'images' => $post->images,
            'likes_count' => $post->likes_count,
            'comments_count' => $post->comments_count,
            'is_active' => $post->is_active,
            'created_at' => $post->created_at,
            'updated_at' => $post->updated_at,
            'category' => $post->category ? [
                'id' => $post->category->id,
                'name' => $post->category->name,
                'slug' => $post->category->slug,
            ] : null,
            'user' => $post->user ? [
                'id' => $post->user->id,
                'name' => $post->user->name,
                'role' => $post->user->role,
                'profile' => $post->user->profile ? [
                    'username' => $post->user->profile->username,
                    'avatar_url' => $post->user->profile->avatar_url,
                    'title' => $post->user->profile->title,
                ] : null,
            ] : null,
            'is_liked' => $isLiked,
            'is_bookmarked' => $isBookmarked,
            'is_following_author' => $isFollowing,
        ];
    }
}
