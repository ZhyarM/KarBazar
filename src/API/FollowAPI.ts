import { apiCall } from "./apiClient";

// Types
export interface FollowUser {
  id: number;
  name: string;
  role: string;
  profile: {
    username: string;
    avatar_url: string | null;
    title: string | null;
  } | null;
  is_following: boolean;
  followed_at: string;
}

interface ToggleFollowResponse {
  success: boolean;
  message: string;
  data: {
    is_following: boolean;
    followers_count: number;
  };
}

interface CheckFollowResponse {
  success: boolean;
  data: {
    is_following: boolean;
  };
}

interface FollowListResponse {
  success: boolean;
  data: FollowUser[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    followers_count: number;
    following_count: number;
  };
}

interface FollowStatsResponse {
  success: boolean;
  data: {
    followers_count: number;
    following_count: number;
    is_following: boolean;
  };
}

// Toggle follow/unfollow
export const toggleFollow = async (
  userId: number,
): Promise<ToggleFollowResponse> => {
  return await apiCall<ToggleFollowResponse>(`/follow/${userId}`, {
    method: "POST",
  });
};

// Check if following
export const checkFollow = async (userId: number): Promise<boolean> => {
  const response = await apiCall<CheckFollowResponse>(
    `/follow/${userId}/check`,
  );
  return response.data.is_following;
};

// Get followers of a user
export const getFollowers = async (
  userId: number,
  page = 1,
): Promise<FollowListResponse> => {
  return await apiCall<FollowListResponse>(
    `/follow/${userId}/followers?page=${page}`,
  );
};

// Get following of a user
export const getFollowing = async (
  userId: number,
  page = 1,
): Promise<FollowListResponse> => {
  return await apiCall<FollowListResponse>(
    `/follow/${userId}/following?page=${page}`,
  );
};

// Get follow stats
export const getFollowStats = async (
  userId: number,
): Promise<FollowStatsResponse> => {
  return await apiCall<FollowStatsResponse>(`/follow/${userId}/stats`);
};
