import { apiCall } from "./apiClient";

// Types
export interface Order {
  id: number;
  gig_id: number;
  buyer_id: number;
  seller_id: number;
  package_type: "basic" | "standard" | "premium";
  price: number;
  delivery_time: number;
  status:
    | "pending"
    | "in_progress"
    | "delivered"
    | "completed"
    | "cancelled"
    | "revision";
  requirements: string | null;
  delivery_note: string | null;
  delivery_files: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  gig: {
    id: number;
    title: string;
    image_url: string | null;
    seller: {
      id: number;
      name: string;
      profile: {
        username: string;
        avatar_url: string | null;
      };
    };
  };
  buyer: {
    id: number;
    name: string;
    email: string;
    profile: {
      username: string;
      avatar_url: string | null;
    };
  };
  seller: {
    id: number;
    name: string;
    email: string;
    profile: {
      username: string;
      avatar_url: string | null;
    };
  };
}

interface OrdersResponse {
  success: boolean;
  data: Order[];
}

interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

// Get all orders (buyer and seller)
export const getOrders = async (): Promise<Order[]> => {
  const response = await apiCall<OrdersResponse>("/orders");
  return response.data;
};

// Get single order
export const getOrder = async (orderId: number): Promise<Order> => {
  const response = await apiCall<OrderResponse>(`/orders/${orderId}`);
  return response.data;
};

// Create order
export const createOrder = async (
  gigId: number,
  packageType: "basic" | "standard" | "premium",
  requirements?: string,
): Promise<Order> => {
  const response = await apiCall<OrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify({
      gig_id: gigId,
      package_type: packageType,
      requirements,
    }),
  });
  return response.data;
};

// Update order status (seller)
export const updateOrderStatus = async (
  orderId: number,
  status: string,
  deliveryNote?: string,
  deliveryFiles?: string,
): Promise<Order> => {
  const response = await apiCall<OrderResponse>(`/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({
      status,
      delivery_note: deliveryNote,
      delivery_files: deliveryFiles,
    }),
  });
  return response.data;
};

// Accept delivery (buyer)
export const acceptDelivery = async (orderId: number): Promise<Order> => {
  const response = await apiCall<OrderResponse>(`/orders/${orderId}/accept`, {
    method: "PUT",
  });
  return response.data;
};

// Request revision (buyer)
export const requestRevision = async (
  orderId: number,
  reason: string,
): Promise<Order> => {
  const response = await apiCall<OrderResponse>(`/orders/${orderId}/revision`, {
    method: "PUT",
    body: JSON.stringify({ requirements: reason }),
  });
  return response.data;
};
