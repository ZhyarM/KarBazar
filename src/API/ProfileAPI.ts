import {
  apiCall,
  getAuthHeaders,
  getAuthHeadersForUpload,
  API_BASE_URL,
} from "./apiClient";

// Types
export interface Education {
  id?: number;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  description?: string;
}

export interface Certification {
  id?: number;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
}

export interface WorkExperience {
  id?: number;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  description?: string;
}

export interface PortfolioItem {
  id?: number;
  title: string;
  description?: string;
  image_url: string;
  project_url?: string;
  category?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  dribbble?: string;
  behance?: string;
  website?: string;
}

export interface Profile {
  id: number;
  user_id: number;
  username: string;
  bio: string | null;
  title: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  location: string | null;
  website: string | null;
  phone: string | null;
  hourly_rate: number | null;
  skills: string[];
  languages: string[];
  education: Education[];
  certifications: Certification[];
  work_experience: WorkExperience[];
  portfolio: PortfolioItem[];
  social_links: SocialLinks | null;
  rating: number;
  total_reviews: number;
  total_jobs: number;
  total_earnings: number;
  response_time: number;
  profile_views: number;
  is_public: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    image: string | null;
    role: string;
  };
}

export interface ProfileStatistics {
  rating: number;
  total_reviews: number;
  total_jobs: number;
  total_earnings: number;
  response_time: number;
  profile_views: number;
  gigs_count: number;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  title?: string;
  location?: string;
  website?: string;
  phone?: string;
  hourly_rate?: number;
  skills?: string[];
  languages?: string[];
  education?: Education[];
  certifications?: Certification[];
  work_experience?: WorkExperience[];
  portfolio?: PortfolioItem[];
  social_links?: SocialLinks;
  is_public?: boolean;
  is_available?: boolean;
}

interface ProfileResponse {
  success: boolean;
  data: Profile;
  message?: string;
}

interface FreelancersResponse {
  success: boolean;
  data: Profile[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface StatisticsResponse {
  success: boolean;
  data: ProfileStatistics;
}

// Get current user's profile
export const getMyProfile = async (): Promise<Profile> => {
  const response = await apiCall<ProfileResponse>("/profile/me");
  return response.data;
};

// Get profile by username
export const getProfileByUsername = async (
  username: string,
): Promise<Profile> => {
  const response = await fetch(`${API_BASE_URL}/profiles/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.data;
};

// Get profile by user ID
export const getProfileByUserId = async (userId: number): Promise<Profile> => {
  const response = await fetch(`${API_BASE_URL}/profiles/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.data;
};

// Get all freelancers with optional filters
export interface FreelancerFilters {
  search?: string;
  skills?: string[];
  location?: string;
  min_rating?: number;
  min_rate?: number;
  max_rate?: number;
  sort_by?:
    | "rating"
    | "total_reviews"
    | "total_jobs"
    | "hourly_rate"
    | "created_at";
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export const getFreelancers = async (
  filters?: FreelancerFilters,
): Promise<FreelancersResponse> => {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.search) params.append("search", filters.search);
    if (filters.skills?.length)
      params.append("skills", filters.skills.join(","));
    if (filters.location) params.append("location", filters.location);
    if (filters.min_rating)
      params.append("min_rating", filters.min_rating.toString());
    if (filters.min_rate)
      params.append("min_rate", filters.min_rate.toString());
    if (filters.max_rate)
      params.append("max_rate", filters.max_rate.toString());
    if (filters.sort_by) params.append("sort_by", filters.sort_by);
    if (filters.sort_order) params.append("sort_order", filters.sort_order);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());
  }

  const url = `${API_BASE_URL}/profiles/freelancers${params.toString() ? "?" + params.toString() : ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

// Update entire profile
export const updateProfile = async (
  data: UpdateProfileData,
): Promise<Profile> => {
  const response = await apiCall<ProfileResponse>("/profile/update", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.data;
};

// Update specific profile section
export const updateProfileSection = async (
  section: string,
  data: Partial<UpdateProfileData>,
): Promise<Profile> => {
  const response = await apiCall<ProfileResponse>(
    `/profile/section/${section}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
  return response.data;
};

// Get profile statistics
export const getProfileStatistics = async (): Promise<ProfileStatistics> => {
  const response = await apiCall<StatisticsResponse>("/profile/statistics");
  return response.data;
};

// Upload profile picture (uses getAuthHeadersForUpload to avoid Content-Type conflict)
export const uploadProfilePicture = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/upload/profile-picture`, {
    method: "POST",
    headers: getAuthHeadersForUpload(),
    body: formData,
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to upload profile picture");
  }
  return data.data.avatar_url;
};

// Upload cover photo
export const uploadCoverPhoto = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/upload/cover-photo`, {
    method: "POST",
    headers: getAuthHeadersForUpload(),
    body: formData,
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to upload cover photo");
  }
  return data.data.cover_url;
};

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<void> => {
  await apiCall<{ success: boolean; message: string }>(
    "/auth/change-password",
    {
      method: "PUT",
      body: JSON.stringify({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      }),
    },
  );
};

// Update user name
export const updateUserName = async (name: string): Promise<void> => {
  await apiCall<{ success: boolean; message: string }>("/auth/update-name", {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
};

// Delete account
export const deleteAccount = async (password: string): Promise<void> => {
  await apiCall<{ success: boolean; message: string }>("/auth/delete-account", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
};
