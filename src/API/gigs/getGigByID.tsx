const BASE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface GigresponseByID {
  success: boolean;
  data: data;
}

interface data {
  id: number;
  seller_id: number;
  catergory_id: number;
  title: string;
  description: string;
  price: number;
  delivery_time: number;
  image_url: string | null;
  gallery: string[] | null;
  tags: tags;
  packages: null;
  requirements: null;
  faq: null;
  rating: string;
  review_count: number;
  order_count: number;
  is_active: boolean;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
  seller: seller;
  category: category;
  reviews: [];
}

interface tags {
  id: number;
  gig_id: number;
  tag: string;
}

interface seller {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: string;
  is_active: boolean;
  email_verified_at: boolean;
  created_at: string;
  profile: profile;
}

interface profile {
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

interface category {
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

export const fetchGigByID = async (payload: payload): Promise<GigresponseByID> => {
  try {
    const response = await fetch(`${BASE_API_URL}/gigs/${payload.id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - Failed to fetch gigs`);
    }
    
      return await response.json();  

  } catch(error) {
      console.error("FetchGigs error:", error);
      throw new Error("An error occurred while fetching gigs");
 
      
  }
};