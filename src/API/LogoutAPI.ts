import { apiCall } from "./apiClient";

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const logout = async (): Promise<void> => {
  try {
    // Call backend logout endpoint to invalidate token
    await apiCall<LogoutResponse>("/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout API error:", error);
    // Continue with local logout even if API call fails
  } finally {
    // Clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    // Redirect to home page
    window.location.href = "/";
  }
};
