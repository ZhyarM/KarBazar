import { apiCall } from "./apiClient";

// Types
export interface PostUser {
  id: number;
  name: string;
  role: string;
  profile: {
    username: string;
    avatar_url: string | null;
    title: string | null;
  } | null;
}

export interface PostCategory {
  id: number;
  name: string;
  slug: string;
}

export interface PostComment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar_url: string | null;
  };
  replies?: PostComment[];
}

export interface Post {
  id: number;
  title: string;
  description: string;
  tags: string[] | null;
  images: string[] | null;
  likes_count: number;
  comments_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: PostCategory | null;
  user: PostUser | null;
  is_liked: boolean;
  is_bookmarked: boolean;
  is_following_author: boolean;
}

export interface CreatePostData {
  title: string;
  description: string;
  category_id?: number;
  tags?: string[];
  images?: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {
  is_active?: boolean;
}

interface PostsResponse {
  success: boolean;
  data: Post[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface PostResponse {
  success: boolean;
  data: Post;
  message?: string;
}

interface GenericResponse {
  success: boolean;
  message: string;
}

interface LikeResponse {
  success: boolean;
  message: string;
  data: { is_liked: boolean; likes_count: number };
}

interface BookmarkResponse {
  success: boolean;
  message: string;
  data: { is_bookmarked: boolean };
}

interface CommentsResponse {
  success: boolean;
  data: PostComment[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface CommentResponse {
  success: boolean;
  message: string;
  data: PostComment;
}

// Get post feed (authenticated - smart algorithm)
export const getPostFeed = async (
  page = 1,
  perPage = 10,
): Promise<PostsResponse> => {
  const response = await apiCall<PostsResponse>(
    `/posts/feed?page=${page}&per_page=${perPage}`,
  );
  return response;
};

// Get public feed (no auth required)
export const getPublicFeed = async (
  page = 1,
  perPage = 10,
): Promise<PostsResponse> => {
  const response = await apiCall<PostsResponse>(
    `/posts/feed?page=${page}&per_page=${perPage}`,
  );
  return response;
};

// Get all posts (browseable with filters)
export const getPosts = async (params?: {
  search?: string;
  tag?: string;
  category_id?: number;
  sort_by?: string;
  page?: number;
  per_page?: number;
}): Promise<PostsResponse> => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/posts?${queryString}` : "/posts";
  return await apiCall<PostsResponse>(endpoint);
};

// Get single post
export const getPost = async (postId: number): Promise<Post> => {
  const response = await apiCall<PostResponse>(`/posts/${postId}`);
  return response.data;
};

// Get my posts
export const getMyPosts = async (): Promise<Post[]> => {
  const response = await apiCall<{ success: boolean; data: Post[] }>(
    "/posts/my-posts",
  );
  return response.data;
};

// Get user's posts
export const getUserPosts = async (
  userId: number,
  page = 1,
): Promise<PostsResponse> => {
  return await apiCall<PostsResponse>(`/posts/user/${userId}?page=${page}`);
};

// Create post
export const createPost = async (data: CreatePostData): Promise<Post> => {
  const response = await apiCall<PostResponse>("/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
};

// Update post
export const updatePost = async (
  postId: number,
  data: UpdatePostData,
): Promise<Post> => {
  const response = await apiCall<PostResponse>(`/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.data;
};

// Delete post
export const deletePost = async (postId: number): Promise<void> => {
  await apiCall<GenericResponse>(`/posts/${postId}`, {
    method: "DELETE",
  });
};

// Toggle like
export const togglePostLike = async (postId: number): Promise<LikeResponse> => {
  return await apiCall<LikeResponse>(`/posts/${postId}/like`, {
    method: "POST",
  });
};

// Toggle bookmark
export const togglePostBookmark = async (
  postId: number,
): Promise<BookmarkResponse> => {
  return await apiCall<BookmarkResponse>(`/posts/${postId}/bookmark`, {
    method: "POST",
  });
};

// Get bookmarked posts
export const getBookmarkedPosts = async (page = 1): Promise<PostsResponse> => {
  return await apiCall<PostsResponse>(`/posts/bookmarked?page=${page}`);
};

// Get comments for a post
export const getPostComments = async (
  postId: number,
  page = 1,
): Promise<CommentsResponse> => {
  return await apiCall<CommentsResponse>(
    `/posts/${postId}/comments?page=${page}`,
  );
};

// Add comment
export const addPostComment = async (
  postId: number,
  content: string,
  parentId?: number,
): Promise<CommentResponse> => {
  return await apiCall<CommentResponse>(`/posts/${postId}/comment`, {
    method: "POST",
    body: JSON.stringify({ content, parent_id: parentId }),
  });
};

// Delete comment
export const deletePostComment = async (
  postId: number,
  commentId: number,
): Promise<void> => {
  await apiCall<GenericResponse>(`/posts/${postId}/comment/${commentId}`, {
    method: "DELETE",
  });
};
