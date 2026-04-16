import { apiCall } from "./apiClient";

export interface PublicStats {
  active_businesses: number;
  projects_completed: number;
  projects_live: number;
  average_rating: number;
}

export const getPublicStats = async (): Promise<PublicStats> => {
  const res = await apiCall<{ success: boolean; data: PublicStats }>(
    "/stats/public-overview",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  return res.data;
};
