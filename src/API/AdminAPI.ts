import { apiCall } from "./apiClient";

export interface AdminOverview {
  total_users: number;
  total_freelancers: number;
  total_clients: number;
  total_gigs: number;
  active_gigs: number;
  total_orders: number;
  pending_orders: number;
  in_progress_orders: number;
  completed_orders: number;
  total_reviews: number;
  average_rating: number;
  total_categories: number;
  new_users_this_month: number;
  orders_this_month: number;
}

export interface AdminActivity {
  type: string;
  message: string;
  date: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: "client" | "business" | "admin";
  is_active: boolean;
  created_at: string;
}

interface PaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface PaginatedUsersResponse {
  success: boolean;
  data: AdminUser[];
  meta: PaginatedMeta;
}

interface SingleUserResponse {
  success: boolean;
  message: string;
  data: AdminUser;
}

interface ApiListResponse<T> {
  success: boolean;
  data: T[];
}

interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta?: PaginatedMeta;
}

interface ApiSingleResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface GetAdminUsersParams {
  search?: string;
  role?: "client" | "freelancer" | "admin";
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AdminGig {
  id: number;
  title: string;
  is_active: boolean;
  seller?: {
    id: number;
    name: string;
  };
}

export interface AdminPost {
  id: number;
  title: string;
  is_active: boolean;
  user?: {
    id: number;
    name: string;
  };
}

export interface AdminCategory {
  id: number;
  name: string;
  description?: string | null;
}

export interface AdminOrder {
  id: number;
  status: string;
  gig?: {
    id: number;
    title: string;
  };
  buyer?: {
    id: number;
    name: string;
  };
  seller?: {
    id: number;
    name: string;
  };
}

export interface AdminReview {
  id: number;
  rating: number;
  comment?: string | null;
  reviewer?: {
    id: number;
    name: string;
  };
  reviewee?: {
    id: number;
    name: string;
  };
  gig?: {
    id: number;
    title: string;
  };
}

export interface AdminSetting {
  id: number;
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "json";
  description?: string | null;
}

export interface UpdateAdminSettingPayload {
  key: string;
  value: string | number | boolean | Record<string, unknown>;
  type: "string" | "number" | "boolean" | "json";
  description?: string;
}

export interface AdminNewsItem {
  id: number;
  title: string;
  description: string;
  tags: string[] | null;
  created_at: string;
  is_active: boolean;
}

export const getAdminOverview = async (): Promise<AdminOverview> => {
  const response = await apiCall<{ success: boolean; data: AdminOverview }>(
    "/analytics/overview",
    { method: "GET" },
  );

  return response.data;
};

export const getRecentAdminActivities = async (): Promise<AdminActivity[]> => {
  const response = await apiCall<{ success: boolean; data: AdminActivity[] }>(
    "/analytics/recent-activities",
    { method: "GET" },
  );

  return response.data;
};

export const getAdminUsers = async (
  params: GetAdminUsersParams = {},
): Promise<PaginatedUsersResponse> => {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.role) query.set("role", params.role);
  if (typeof params.is_active === "boolean") {
    query.set("is_active", String(params.is_active));
  }
  if (params.page) query.set("page", String(params.page));
  if (params.per_page) query.set("per_page", String(params.per_page));

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiCall<PaginatedUsersResponse>(`/admin/users${suffix}`, {
    method: "GET",
  });
};

export const getAdminAccounts = async (): Promise<PaginatedUsersResponse> => {
  return apiCall<PaginatedUsersResponse>("/admin/users/admins", {
    method: "GET",
  });
};

export const createAdminAccount = async (
  payload: CreateAdminPayload,
): Promise<SingleUserResponse> => {
  return apiCall<SingleUserResponse>("/admin/users/admins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateAdminUserStatus = async (
  userId: number,
  isActive: boolean,
): Promise<SingleUserResponse> => {
  return apiCall<SingleUserResponse>(`/admin/users/${userId}/status`, {
    method: "PUT",
    body: JSON.stringify({ is_active: isActive }),
  });
};

export const updateAdminUserRole = async (
  userId: number,
  role: "client" | "freelancer" | "admin",
): Promise<SingleUserResponse> => {
  return apiCall<SingleUserResponse>(`/admin/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
};

export const deleteAdminUser = async (
  userId: number,
): Promise<{ success: boolean; message: string }> => {
  return apiCall<{ success: boolean; message: string }>(
    `/admin/users/${userId}`,
    {
      method: "DELETE",
    },
  );
};

export const getAdminListings = async (): Promise<AdminGig[]> => {
  const response = await apiCall<ApiListResponse<AdminGig>>("/gigs", {
    method: "GET",
  });

  return response.data;
};

export const moderateGigStatus = async (
  gigId: number,
  isActive: boolean,
): Promise<void> => {
  await apiCall<ApiSingleResponse<AdminGig>>(`/gigs/${gigId}`, {
    method: "PUT",
    body: JSON.stringify({ is_active: isActive }),
  });
};

export const getAdminPosts = async (): Promise<AdminPost[]> => {
  const response = await apiCall<ApiListResponse<AdminPost>>("/posts", {
    method: "GET",
  });

  return response.data;
};

export const moderatePostStatus = async (
  postId: number,
  isActive: boolean,
): Promise<void> => {
  await apiCall<ApiSingleResponse<AdminPost>>(`/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify({ is_active: isActive }),
  });
};

export const getAdminCategories = async (): Promise<AdminCategory[]> => {
  const response = await apiCall<ApiListResponse<AdminCategory>>(
    "/categories",
    {
      method: "GET",
    },
  );

  return response.data;
};

export const createAdminCategory = async (payload: {
  name: string;
  description?: string;
}): Promise<void> => {
  await apiCall<ApiSingleResponse<AdminCategory>>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateAdminCategory = async (
  categoryId: number,
  payload: { name?: string; description?: string },
): Promise<void> => {
  await apiCall<ApiSingleResponse<AdminCategory>>(`/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteAdminCategory = async (
  categoryId: number,
): Promise<void> => {
  await apiCall<{ success: boolean; message: string }>(
    `/categories/${categoryId}`,
    {
      method: "DELETE",
    },
  );
};

export const getAdminOrders = async (): Promise<AdminOrder[]> => {
  const response = await apiCall<ApiListResponse<AdminOrder>>("/orders", {
    method: "GET",
  });

  return response.data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: string,
): Promise<void> => {
  await apiCall<{ success: boolean; message: string }>(
    `/orders/${orderId}/status`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    },
  );
};

export const getAdminReviews = async (): Promise<AdminReview[]> => {
  const response = await apiCall<ApiListResponse<AdminReview>>(
    "/admin/reviews",
    {
      method: "GET",
    },
  );

  return response.data;
};

export const deleteAdminReview = async (reviewId: number): Promise<void> => {
  await apiCall<{ success: boolean; message: string }>(`/reviews/${reviewId}`, {
    method: "DELETE",
  });
};

export const publishAdminNews = async (payload: {
  title: string;
  description: string;
}): Promise<void> => {
  await apiCall<{ success: boolean; message: string }>("/posts", {
    method: "POST",
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      tags: ["news", "announcement"],
    }),
  });
};

export const getAdminNewsHistory = async (
  page = 1,
  perPage = 50,
): Promise<AdminNewsItem[]> => {
  const response = await apiCall<ApiPaginatedResponse<AdminNewsItem>>(
    `/posts?tag=announcement&sort_by=created_at&sort_order=desc&page=${page}&per_page=${perPage}`,
    {
      method: "GET",
    },
  );

  return response.data;
};

export const deleteAdminNews = async (postId: number): Promise<void> => {
  await apiCall<{ success: boolean; message: string }>(`/posts/${postId}`, {
    method: "DELETE",
  });
};

export const getAdminSettings = async (): Promise<AdminSetting[]> => {
  const response = await apiCall<ApiListResponse<AdminSetting>>(
    "/admin/settings",
    {
      method: "GET",
    },
  );

  return response.data;
};

export const updateAdminSetting = async (
  payload: UpdateAdminSettingPayload,
): Promise<void> => {
  await apiCall<{ success: boolean; message: string }>(
    "/admin/settings/update",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
};
