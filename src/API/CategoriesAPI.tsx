import { apiCall } from "./apiClient";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  gig_count: number;
}

interface ResponseData {
  success: boolean;
  data: Category[];
}

const fetchCategories = async (): Promise<ResponseData> => {
  try {
    const response = await apiCall<{ success: boolean; data: unknown }>(
      "/categories",
    );

    const rawCategories = Array.isArray(response.data)
      ? response.data
      : response.data &&
          typeof response.data === "object" &&
          Array.isArray((response.data as { data?: unknown[] }).data)
        ? ((response.data as { data?: unknown[] }).data ?? [])
        : [];

    const categories: Category[] = rawCategories.map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return {
        id: Number(row.id ?? 0),
        name: String(row.name ?? ""),
        slug: String(row.slug ?? ""),
        description: String(row.description ?? ""),
        icon: String(row.icon ?? ""),
        gig_count: Number(row.gig_count ?? 0),
      };
    });

    return { success: response.success, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, data: [] };
  }
};

// Alias for compatibility
const getCategories = async () => {
  const response = await fetchCategories();
  return response.success ? response.data : [];
};

export { fetchCategories, getCategories };
