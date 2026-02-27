import { apiCall } from "./apiClient";

// Types
export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data: any;
  read_at: string | null;
  created_at: string;
}

interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

interface UnreadCountResponse {
  success: boolean;
  data: {
    unread_count: number;
  };
}

interface GenericResponse {
  success: boolean;
  message: string;
}

// Get all notifications
export const getNotifications = async (): Promise<Notification[]> => {
  const response = await apiCall<NotificationsResponse>("/notifications");
  return response.data;
};

// Get unread count
export const getUnreadCount = async (): Promise<number> => {
  const response = await apiCall<UnreadCountResponse>(
    "/notifications/unread-count",
  );
  return response.data.unread_count;
};

// Mark notification as read
export const markNotificationAsRead = async (
  notificationId: number,
): Promise<void> => {
  await apiCall<GenericResponse>(`/notifications/${notificationId}/read`, {
    method: "PUT",
  });
};

// Mark all as read
export const markAllAsRead = async (): Promise<void> => {
  await apiCall<GenericResponse>("/notifications/mark-all-read", {
    method: "PUT",
  });
};

// Delete notification
export const deleteNotification = async (
  notificationId: number,
): Promise<void> => {
  await apiCall<GenericResponse>(`/notifications/${notificationId}`, {
    method: "DELETE",
  });
};

// Clear all notifications
export const clearAllNotifications = async (): Promise<void> => {
  await apiCall<GenericResponse>("/notifications/clear-all", {
    method: "DELETE",
  });
};
