import { useEffect, useState } from "react";
import {
  getAdminOrders,
  updateOrderStatus,
  type AdminOrder,
} from "../../API/AdminAPI";
import { useLanguage } from "../../context/LanguageContext";

function AdminOrdersPage() {
  const { t } = useLanguage();
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
      t("admin.orders.statusPrompt"),
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
      alert(
        error instanceof Error ? error.message : t("admin.orders.updateFailed"),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text)">
          {t("admin.orders.title")}
        </h2>
        <p className="text-(--color-text-muted) mt-2">
          {t("admin.orders.subtitle")}
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
                  <th className="py-3">{t("admin.orders.id")}</th>
                  <th className="py-3">{t("admin.orders.gig")}</th>
                  <th className="py-3">{t("admin.orders.buyer")}</th>
                  <th className="py-3">{t("admin.orders.seller")}</th>
                  <th className="py-3">{t("admin.orders.status")}</th>
                  <th className="py-3">{t("admin.orders.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-(--color-border) text-(--color-text)"
                  >
                    <td className="py-3">#{order.id}</td>
                    <td className="py-3">
                      {order.gig?.title || t("admin.orders.notAvailable")}
                    </td>
                    <td className="py-3">
                      {order.buyer?.name || t("admin.orders.notAvailable")}
                    </td>
                    <td className="py-3">
                      {order.seller?.name || t("admin.orders.notAvailable")}
                    </td>
                    <td className="py-3 capitalize">
                      {order.status.replace("_", " ")}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(order)}
                        className="px-3 py-1 rounded-md border border-(--color-border) text-sm"
                      >
                        {t("admin.orders.updateStatus")}
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
