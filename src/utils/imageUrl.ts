/**
 * Image URL utility for handling asset URLs
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

/**
 * Convert a relative or database path to a full asset URL
 * Handles various formats: relative paths, storage paths, full URLs
 */
export const getImageUrl = (path?: string | null): string => {
  if (!path) {
    return "";
  }

  // If already a full URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // If it starts with /storage/, prepend backend URL
  if (path.startsWith("/storage/")) {
    return `${BACKEND_URL}${path}`;
  }

  // Otherwise, it's a bare relative path (e.g. "avatars/abc.png") — add /storage/ prefix
  return `${BACKEND_URL}/storage/${path}`;
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
