import { cache } from "react";

// 1. In Vite, use VITE_ prefix and 'import.meta.env.VITE_...'
// import.meta.env.BASE_URL is actually a Vite internal for the project root path
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
  packages: any | null;
  requirements: string | null;
  faq: any | null;
  rating: string;
  review_count: number;
  order_count: number;
  is_active: boolean;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
  seller: Seller;
  category: Category;
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

/**
 * API FUNCTIONS
 */

// We use React 'cache' for Server Components to prevent duplicate requests
export const fetchGigs = cache(
  async (page: number = 1): Promise<GigResponse> => {
    try {
      // Adding the page parameter to the URL
      const response = await fetch(`${BASE_API_URL}/gigs?page=${page}`, {
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
  },
);
