const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface GigresponseByID {
  success: boolean;
  data: GigDetailData;
}

export interface GigDetailData {
  id: number;
  seller_id: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  delivery_time: number;
  image_url: string | null;
  gallery: string[] | null;
  tags: string[] | null;
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
  seller: GigSeller;
  category: GigCategory;
  reviews: any[];
}

export interface PackageTier {
  price: number;
  description: string;
  delivery_time: number;
  features: string[];
}

export interface GigSeller {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: string;
  is_active: boolean;
  email_verified_at: boolean;
  created_at: string;
  profile: GigSellerProfile;
}

export interface GigSellerProfile {
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
  skills: string[] | null;
  languages: string[] | null;
  rating: string;
  total_reviews: number;
  total_jobs: number;
  total_earnings: number;
  response_time: number;
  created_at: string;
}

export interface GigCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  gig_count: number;
  created_at: string;
}

interface payload {
  id: number;
}

export const fetchGigByID = async (
  payload: payload,
): Promise<GigresponseByID> => {
  try {
    // Include auth token if available for view tracking
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "content-type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_API_URL}/gigs/${payload.id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - Failed to fetch gig`);
    }

    return await response.json();
  } catch (error) {
    console.error("FetchGig error:", error);
    throw new Error("An error occurred while fetching gig");
  }
};
