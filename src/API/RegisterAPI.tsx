import { normalizeRoleForUi, toApiRole, type UiRole } from "../utils/roles";
import { API_BASE_URL } from "./apiClient";

interface UserProfile {
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
  skills: string | null;
  languages: string | null;
  rating: string;
  total_reviews: number;
  total_jobs: number;
  total_earnings: number;
  response_time: number;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: UiRole;
  is_active: boolean | null;
  email_verified_at: string | null;
  created_at: string;
  profile: UserProfile;
}

interface AuthData {
  user: User;
  token: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData | null;
}

interface requestPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UiRole;
  business_category?: string;
}

const registerUser = async (payload: requestPayload): Promise<AuthResponse> => {
  try {
    const apiPayload = {
      ...payload,
      role: toApiRole(payload.role),
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(apiPayload),
      credentials: "omit",
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      // Extract validation errors from Laravel response
      const errorData = data as any;
      if (errorData.errors && typeof errorData.errors === "object") {
        const validationErrors = Object.values(errorData.errors)
          .flat()
          .join(", ");
        console.error("Validation errors:", errorData.errors);
        throw new Error(
          validationErrors ||
            errorData.message ||
            `HTTP error! status: ${response.status}`,
        );
      }
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    if (data.data?.user) {
      data.data.user.role = normalizeRoleForUi(data.data.user.role);
    }

    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      message: (error as Error).message || "Error registering user",
      data: null,
    };
  }
};

export { registerUser };
