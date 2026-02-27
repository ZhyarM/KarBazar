import { apiCall } from "./apiClient";

// Types
export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  attachments: string | null;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
  sender: {
    id: number;
    name: string;
    email: string;
    image: string | null;
    profile: {
      username: string;
      avatar_url: string | null;
    };
  };
  receiver: {
    id: number;
    name: string;
    email: string;
    image: string | null;
    profile: {
      username: string;
      avatar_url: string | null;
    };
  };
}

export interface Conversation {
  user: {
    id: number;
    name: string;
    email: string;
    image: string | null;
    profile: {
      username: string;
      avatar_url: string | null;
    };
  };
  last_message: {
    content: string;
    created_at: string;
    is_sent_by_me: boolean;
  };
  unread_count: number;
}

interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
}

interface MessagesResponse {
  success: boolean;
  data: Message[];
}

interface MessageResponse {
  success: boolean;
  message: string;
  data: Message;
}

interface GenericResponse {
  success: boolean;
  message: string;
}

// Get all conversations
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await apiCall<ConversationsResponse>(
    "/messages/conversations",
  );
  return response.data;
};

// Get messages with a specific user
export const getMessages = async (userId: number): Promise<Message[]> => {
  const response = await apiCall<MessagesResponse>(`/messages/${userId}`);
  return response.data;
};

// Send a message
export const sendMessage = async (
  receiverId: number,
  message: string,
  attachmentUrl?: string,
): Promise<Message> => {
  const response = await apiCall<MessageResponse>("/messages", {
    method: "POST",
    body: JSON.stringify({
      receiver_id: receiverId,
      content: message,
      attachments: attachmentUrl,
    }),
  });
  return response.data;
};

// Mark message as read
export const markMessageAsRead = async (messageId: number): Promise<void> => {
  await apiCall<GenericResponse>(`/messages/${messageId}/read`, {
    method: "PUT",
  });
};

// Delete message
export const deleteMessage = async (messageId: number): Promise<void> => {
  await apiCall<GenericResponse>(`/messages/${messageId}`, {
    method: "DELETE",
  });
};
