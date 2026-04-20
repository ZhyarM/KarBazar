import { useEffect, useState } from "react";
import {
  getAdminOrders,
  updateOrderStatus,
  type AdminOrder,
} from "../../API/AdminAPI";

function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (order: AdminOrder) => {
    const nextStatus = window.prompt(
      "Set order status (pending, in_progress, delivered, revision, completed, cancelled)",
      order.status,
    );

    if (!nextStatus || nextStatus === order.status) {
      return;
    }

    try {
      await updateOrderStatus(order.id, nextStatus);
      await loadOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert(error instanceof Error ? error.message : "Failed to update order.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text)">
          View All Orders
        </h2>
        <p className="text-(--color-text-muted) mt-2">
          Review order statuses and intervene when needed.
        </p>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-(--color-primary)"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-(--color-text-muted) border-b border-(--color-border)">
                  <th className="py-3">ID</th>
                  <th className="py-3">Gig</th>
                  <th className="py-3">Buyer</th>
                  <th className="py-3">Seller</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-(--color-border) text-(--color-text)"
                  >
                    <td className="py-3">#{order.id}</td>
                    <td className="py-3">{order.gig?.title || "N/A"}</td>
                    <td className="py-3">{order.buyer?.name || "N/A"}</td>
                    <td className="py-3">{order.seller?.name || "N/A"}</td>
                    <td className="py-3 capitalize">
                      {order.status.replace("_", " ")}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(order)}
                        className="px-3 py-1 rounded-md border border-(--color-border) text-sm"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;
