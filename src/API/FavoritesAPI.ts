import { apiCall } from "./apiClient";

// Types
export interface FavoriteGig {
  id: number;
  title: string;
  description: string;
  category_id: number;
  seller_id: number;
  image_url: string | null;
  starting_price: number;
  delivery_time: number;
  rating: string;
  total_reviews: number;
  total_orders: number;
  seller: {
    id: number;
    name: string;
    profile: {
      username: string;
      avatar_url: string | null;
    };
  };
}

export interface FavoriteFreelancer {
  id: number;
  name: string;
  email: string;
  profile: {
    username: string;
    bio: string | null;
    title: string | null;
    avatar_url: string | null;
    rating: string;
    total_reviews: number;
    skills: string | null;
  };
}

interface FavoriteGigsResponse {
  success: boolean;
  data: FavoriteGig[];
}

interface FavoriteFreelancersResponse {
  success: boolean;
  data: FavoriteFreelancer[];
}

interface ToggleResponse {
  success: boolean;
  message: string;
  is_favorited: boolean;
}

interface CheckResponse {
  success: boolean;
  is_favorited: boolean;
}

// Get favorite gigs
export const getFavoriteGigs = async (): Promise<FavoriteGig[]> => {
  const response = await apiCall<FavoriteGigsResponse>("/favorites/gigs");
  return response.data;
};

// Get favorite freelancers
export const getFavoriteFreelancers = async (): Promise<
  FavoriteFreelancer[]
> => {
  const response = await apiCall<FavoriteFreelancersResponse>(
    "/favorites/freelancers",
  );
  return response.data;
};

// Toggle gig favorite
export const toggleGigFavorite = async (gigId: number): Promise<boolean> => {
  const response = await apiCall<ToggleResponse>(`/favorites/gigs/${gigId}`, {
    method: "POST",
  });
  return response.is_favorited;
};

// Toggle freelancer favorite
export const toggleFreelancerFavorite = async (
  userId: number,
): Promise<boolean> => {
  const response = await apiCall<ToggleResponse>(
    `/favorites/freelancers/${userId}`,
    {
      method: "POST",
    },
  );
  return response.is_favorited;
};

// Check if gig is favorited
export const checkGigFavorite = async (gigId: number): Promise<boolean> => {
  const response = await apiCall<CheckResponse>(
    `/favorites/gigs/${gigId}/check`,
  );
  return response.is_favorited;
};

// Check if freelancer is favorited
export const checkFreelancerFavorite = async (
  userId: number,
): Promise<boolean> => {
  const response = await apiCall<CheckResponse>(
    `/favorites/freelancers/${userId}/check`,
  );
  return response.is_favorited;
};
