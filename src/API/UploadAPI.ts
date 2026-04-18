import { apiCall, getAuthHeadersForUpload } from "./apiClient";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

interface GenericResponse {
  success: boolean;
  message: string;
}

// Upload profile picture
export const uploadProfilePicture = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/upload/profile-picture`, {
    method: "POST",
    headers: getAuthHeadersForUpload(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload profile picture");
  }

  const data = await response.json();
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

  if (!response.ok) {
    throw new Error("Failed to upload cover photo");
  }

  const data = await response.json();
  return data.data.cover_url;
};

// Upload gig image
export const uploadGigImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/upload/gig-image`, {
    method: "POST",
    headers: getAuthHeadersForUpload(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload gig image");
  }

  const data = await response.json();
  return data.data.image_url;
};

// Upload gig gallery images
export const uploadGigGallery = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`images[${index}]`, file);
  });

  const response = await fetch(`${API_BASE_URL}/upload/gig-gallery`, {
    method: "POST",
    headers: getAuthHeadersForUpload(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload gig gallery");
  }

  const data: { success: boolean; data: { images: string[] } } =
    await response.json();
  return data.data.images;
};

// Upload delivery files
export const uploadDeliveryFiles = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });

  const response = await fetch(`${API_BASE_URL}/upload/delivery-files`, {
    method: "POST",
    headers: getAuthHeadersForUpload(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload delivery files");
  }

  const data: {
    success: boolean;
    data: {
      files: { name: string; url: string; size: number; type: string }[];
    };
  } = await response.json();
  return data.data.files.map((f) => f.url);
};

// Upload message attachment
export const uploadMessageAttachment = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload/message-attachment`, {
    method: "POST",
    headers: getAuthHeadersForUpload(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload message attachment");
  }

  const data: UploadResponse = await response.json();
  return data.data.url;
};

// Delete file
export const deleteFile = async (fileUrl: string): Promise<void> => {
  await apiCall<GenericResponse>("/upload/delete-file", {
    method: "DELETE",
    body: JSON.stringify({ file_url: fileUrl }),
  });
};
