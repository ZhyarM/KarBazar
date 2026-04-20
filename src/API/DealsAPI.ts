import { apiCall } from "./apiClient";

export interface DealsPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DealsCategory {
  id: number;
  name: string;
  slug: string;
}

export interface DealsSellerProfile {
  username: string;
  avatar_url: string | null;
  title: string | null;
}

export interface DealsSeller {
  id: number;
  name: string;
  image: string | null;
  profile: DealsSellerProfile | null;
}

export interface DealGig {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  rating: string;
  review_count: number;
  seller: DealsSeller;
  category: DealsCategory | null;
  packages: Record<string, unknown> | null;
}

export interface DealItem {
  id: number;
  gig_id: number;
  package_key: "basic" | "standard" | "premium" | string;
  package_label: string;
  discount_percentage: number;
  original_price: number;
  discounted_price: number;
  expires_at: string | null;
  is_expiring_soon: boolean;
  is_active: boolean;
  created_at: string;
  gig: DealGig;
}

export interface DealsResponse {
  success: boolean;
  data: DealItem[];
  meta: DealsPaginationMeta;
}

export interface DealFilters {
  page?: number;
  per_page?: number;
  gig_id?: number;
  category_id?: number;
  package_key?: "basic" | "standard" | "premium" | string;
  discount_min?: number;
  discount_max?: number;
  expiring_soon?: boolean;
}

export interface DealWriteData {
  gig_id: number;
  package_key: "basic" | "standard" | "premium" | string;
  discount_percentage: number;
  expires_at?: string | null;
  is_active?: boolean;
}

export const fetchDeals = async (
  filters: DealFilters = {},
): Promise<DealsResponse> => {
  const params = new URLSearchParams();

  if (filters.page) params.set("page", String(filters.page));
  if (filters.per_page) params.set("per_page", String(filters.per_page));
  if (filters.gig_id) params.set("gig_id", String(filters.gig_id));
  if (filters.category_id)
    params.set("category_id", String(filters.category_id));
  if (filters.package_key) params.set("package_key", filters.package_key);
  if (typeof filters.discount_min === "number") {
    params.set("discount_min", String(filters.discount_min));
  }
  if (typeof filters.discount_max === "number") {
    params.set("discount_max", String(filters.discount_max));
  }
  if (typeof filters.expiring_soon === "boolean") {
    params.set("expiring_soon", String(filters.expiring_soon));
  }

  const query = params.toString();
  const endpoint = query ? `/deals?${query}` : "/deals";

  return apiCall<DealsResponse>(endpoint);
};

export const createDeal = async (data: DealWriteData): Promise<DealItem> => {
  const response = await apiCall<{ success: boolean; data: DealItem }>(
    "/deals",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  return response.data;
};

export const updateDeal = async (
  dealId: number,
  data: Partial<Omit<DealWriteData, "gig_id" | "package_key">>,
): Promise<DealItem> => {
  const response = await apiCall<{ success: boolean; data: DealItem }>(
    `/deals/${dealId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );

  return response.data;
};

export const deleteDeal = async (dealId: number): Promise<void> => {
  await apiCall<{ success: boolean; message: string }>(`/deals/${dealId}`, {
    method: "DELETE",
  });
};
