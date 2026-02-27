import { apiCall } from "./apiClient";

// Types
export interface Gig {
  id: number;
  seller_id: number;
  category_id: number;
  title: string;
  description: string;
  image_url: string | null;
  gallery: string | null;
  tags: string | null;
  basic_price: number;
  basic_delivery_time: number;
  basic_description: string;
  standard_price: number | null;
  standard_delivery_time: number | null;
  standard_description: string | null;
  premium_price: number | null;
  premium_delivery_time: number | null;
  premium_description: string | null;
  faqs: string | null;
  requirements: string | null;
  starting_price: number;
  delivery_time: number;
  rating: string;
  total_reviews: number;
  total_orders: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  seller: {
    id: number;
    name: string;
    profile: {
      username: string;
      avatar_url: string | null;
      rating: string;
      total_reviews: number;
    };
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface CreateGigData {
  category_id: number;
  title: string;
  description: string;
  image_url?: string;
  gallery?: string[];
  tags?: string[];
  basic_price: number;
  basic_delivery_time: number;
  basic_description: string;
  standard_price?: number;
  standard_delivery_time?: number;
  standard_description?: string;
  premium_price?: number;
  premium_delivery_time?: number;
  premium_description?: string;
  faqs?: Array<{ question: string; answer: string }>;
  requirements?: string;
}

export interface UpdateGigData extends Partial<CreateGigData> {}

interface GigsResponse {
  success: boolean;
  data: Gig[];
}

interface GigResponse {
  success: boolean;
  data: Gig;
  message?: string;
}

interface GenericResponse {
  success: boolean;
  message: string;
}

// Get all gigs (with optional filters)
export const getGigs = async (params?: {
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  delivery_time?: number;
  rating?: number;
}): Promise<Gig[]> => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/gigs?${queryString}` : "/gigs";
  const response = await apiCall<GigsResponse>(endpoint);
  return response.data;
};

// Get single gig
export const getGig = async (gigId: number): Promise<Gig> => {
  const response = await apiCall<GigResponse>(`/gigs/${gigId}`);
  return response.data;
};

// Get my gigs
export const getMyGigs = async (): Promise<Gig[]> => {
  const response = await apiCall<GigsResponse>("/gigs/my-gigs");
  return response.data;
};

// Create gig
export const createGig = async (data: CreateGigData): Promise<Gig> => {
  const response = await apiCall<GigResponse>("/gigs", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
};

// Update gig
export const updateGig = async (
  gigId: number,
  data: UpdateGigData,
): Promise<Gig> => {
  const response = await apiCall<GigResponse>(`/gigs/${gigId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.data;
};

// Delete gig
export const deleteGig = async (gigId: number): Promise<void> => {
  await apiCall<GenericResponse>(`/gigs/${gigId}`, {
    method: "DELETE",
  });
};
