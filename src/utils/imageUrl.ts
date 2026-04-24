/**
 * Image URL utility for handling asset URLs
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const normalizeBackendUrl = (): string => {
  const envBackendUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;
  if (envBackendUrl && envBackendUrl.trim().length > 0) {
    return envBackendUrl.replace(/\/$/, "");
  }

  try {
    const apiOrigin = new URL(API_BASE_URL).origin;
    return apiOrigin.replace(/\/$/, "");
  } catch {
    return "http://127.0.0.1:8000";
  }
};

const BACKEND_URL = normalizeBackendUrl();
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin.replace(/\/$/, "");
  } catch {
    return BACKEND_URL;
  }
})();

/**
 * Convert a relative or database path to a full asset URL
 * Handles various formats: relative paths, storage paths, full URLs
 */
export const getImageUrl = (path?: string | null): string => {
  return getImageUrlCandidates(path)[0] || "";
};

export const getImageUrlCandidates = (path?: string | null): string[] => {
  if (!path) {
    return [];
  }

  const normalizedPath = path.trim();
  if (!normalizedPath) {
    return [];
  }

  const candidates: string[] = [];

  // If already a full URL, keep it but also derive api/media fallback when it targets /storage/
  if (
    normalizedPath.startsWith("http://") ||
    normalizedPath.startsWith("https://")
  ) {
    candidates.push(normalizedPath);

    try {
      const parsed = new URL(normalizedPath);
      if (parsed.pathname.startsWith("/storage/")) {
        const mediaPath = parsed.pathname.replace(/^\/storage\//, "");
        candidates.push(`${parsed.origin}/api/media/${mediaPath}`);
      }
    } catch {
      // ignore parse errors and keep original URL
    }

    return [...new Set(candidates)];
  }

  // If it starts with /storage/ or storage/, prepend backend URL once and add api fallback
  if (normalizedPath.startsWith("/storage/")) {
    const mediaPath = normalizedPath.replace(/^\/storage\//, "");
    candidates.push(`${BACKEND_URL}${normalizedPath}`);
    candidates.push(`${API_ORIGIN}/api/media/${mediaPath}`);
    return [...new Set(candidates)];
  }

  if (normalizedPath.startsWith("storage/")) {
    const mediaPath = normalizedPath.replace(/^storage\//, "");
    candidates.push(`${BACKEND_URL}/${normalizedPath}`);
    candidates.push(`${API_ORIGIN}/api/media/${mediaPath}`);
    return [...new Set(candidates)];
  }

  // Otherwise, it's a bare relative path (e.g. "avatars/abc.png")
  candidates.push(`${BACKEND_URL}/storage/${normalizedPath}`);
  candidates.push(`${API_ORIGIN}/api/media/${normalizedPath}`);

  return [...new Set(candidates)];
};

/**
 * Get avatar image URL with fallback
 */
export const getAvatarUrl = (avatar?: string | null): string => {
  return getImageUrl(avatar);
};

/**
 * Get gig image URL with fallback
 */
export const getGigImageUrl = (image?: string | null): string => {
  return getImageUrl(image);
};

/**
 * Convert array of image paths to full URLs
 */
export const getGalleryImages = (
  gallery?: (string | null)[] | null,
): string[] => {
  if (!gallery || !Array.isArray(gallery)) {
    return [];
  }

  return gallery
    .filter((img) => img !== null && img !== undefined)
    .map((img) => getImageUrl(img as string));
};
