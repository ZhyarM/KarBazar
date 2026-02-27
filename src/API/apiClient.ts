// API Client Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Helper function to get auth headers
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to get auth headers for file upload
export const getAuthHeadersForUpload = (): HeadersInit => {
  const token = getAuthToken();
  return {
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API call function
export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: getAuthHeaders(),
  };

  // Merge headers properly to avoid overriding auth headers
  const mergedOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Handle Laravel validation errors
    if (errorData.errors) {
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

  return response.json();
};

export { API_BASE_URL };
export default API_BASE_URL;
