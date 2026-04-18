const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/** * TYPES
 */
export interface GigResponse {
  success: boolean;
  data: Gig[];
  meta: PaginationMeta;
}

export interface Gig {
  id: number;
  seller_id: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  delivery_time: number;
  image_url: string | null;
  gallery: string[] | null;
  tags: string[];
  packages: {
    basic?: PackageTier;
    standard?: PackageTier;
    premium?: PackageTier;
  } | null;
  requirements: string | null;
  faq: Array<{ question: string; answer: string }> | null;
  rating: string;
  review_count: number;
  order_count: number;
  view_count: number;
  is_active: boolean;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
  seller: Seller;
  category: Category;
}

export interface PackageTier {
  price: number;
  description: string;
  delivery_time: number;
  features: string[];
}

export interface Seller {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: string;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  profile: SellerProfile;
}

export interface SellerProfile {
  id: number;
  user_id: number;
  username: string;
  bio: string | null;
  title: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  location: string | null;
  website: string | null;
  hourly_rate: number | null;
  skills: any | null;
  languages: any | null;
  rating: string;
  total_reviews: number;
  total_jobs: number;
  total_earnings: number;
  response_time: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  gig_count: number;
  created_at: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface GigFilters {
  page?: number;
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  max_delivery_time?: number;
  min_rating?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/**
 * API FUNCTIONS
 */
export const fetchGigs = async (
  filters: GigFilters = {},
): Promise<GigResponse> => {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.category_id)
      params.append("category_id", filters.category_id.toString());
    if (filters.min_price !== undefined && filters.min_price > 0)
      params.append("min_price", filters.min_price.toString());
    if (filters.max_price !== undefined && filters.max_price < 1000)
      params.append("max_price", filters.max_price.toString());
    if (filters.max_delivery_time)
      params.append("max_delivery_time", filters.max_delivery_time.toString());
    if (filters.min_rating)
      params.append("min_rating", filters.min_rating.toString());
    if (filters.sort_by) params.append("sort_by", filters.sort_by);
    if (filters.sort_order) params.append("sort_order", filters.sort_order);

    const queryString = params.toString();
    const url = queryString
      ? `${BASE_API_URL}/gigs?${queryString}`
      : `${BASE_API_URL}/gigs`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - Failed to fetch gigs`);
    }

    return await response.json();
  } catch (error) {
    console.error("FetchGigs error:", error);
    throw new Error("An error occurred while fetching gigs");
  }
};
