import { apiCall } from "./apiClient";

// Types
export interface Review {
  id: number;
  gig_id: number;
  order_id: number;
  reviewer_id: number;
  reviewee_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  reviewer: {
    id: number;
    name: string;
    profile: {
      username: string;
      avatar_url: string | null;
    };
  };
  gig?: {
    id: number;
    title: string;
  };
}

interface ReviewsResponse {
  success: boolean;
  data: Review[];
}

interface ReviewResponse {
  success: boolean;
  data: Review;
  message: string;
}

interface GenericResponse {
  success: boolean;
  message: string;
}

// Get reviews for a gig
export const getGigReviews = async (gigId: number): Promise<Review[]> => {
  const response = await apiCall<ReviewsResponse>(`/reviews/gig/${gigId}`);
  return response.data;
};

// Get reviews for a user
export const getUserReviews = async (userId: number): Promise<Review[]> => {
  const response = await apiCall<ReviewsResponse>(`/reviews/user/${userId}`);
  return response.data;
};

// Create review
export const createReview = async (
  orderId: number,
  gigId: number,
  revieweeId: number,
  rating: number,
  comment: string,
): Promise<Review> => {
  const response = await apiCall<ReviewResponse>("/reviews", {
    method: "POST",
    body: JSON.stringify({
      order_id: orderId,
      gig_id: gigId,
      reviewee_id: revieweeId,
      rating,
      comment,
    }),
  });
  return response.data;
};

// Update review
export const updateReview = async (
  reviewId: number,
  rating: number,
  comment: string,
): Promise<Review> => {
  const response = await apiCall<ReviewResponse>(`/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify({
      rating,
      comment,
    }),
  });
  return response.data;
};

// Delete review
export const deleteReview = async (reviewId: number): Promise<void> => {
  await apiCall<GenericResponse>(`/reviews/${reviewId}`, {
    method: "DELETE",
  });
};
