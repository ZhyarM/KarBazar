import { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
  acceptDelivery,
  requestRevision,
} from "../API/OrdersAPI";
import type { Order } from "../API/OrdersAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getImageUrl } from "../utils/imageUrl";
import {
  faShoppingCart,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faTruck,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "buying" | "selling">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [revisionReason, setRevisionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverOrder = async () => {
    if (!selectedOrder || !deliveryNote.trim()) return;

    setActionLoading(true);
    try {
      await updateOrderStatus(selectedOrder.id, "delivered", deliveryNote);
      await loadOrders();
      setShowDeliveryModal(false);
      setDeliveryNote("");
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to deliver order:", error);
      alert("Failed to deliver order. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptDelivery = async (orderId: number) => {
    setActionLoading(true);
    try {
      await acceptDelivery(orderId);
      await loadOrders();
    } catch (error) {
      console.error("Failed to accept delivery:", error);
      alert("Failed to accept delivery. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!selectedOrder || !revisionReason.trim()) return;

    setActionLoading(true);
    try {
      await requestRevision(selectedOrder.id, revisionReason);
      await loadOrders();
      setShowRevisionModal(false);
      setRevisionReason("");
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to request revision:", error);
      alert("Failed to request revision. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartOrder = async (orderId: number) => {
    setActionLoading(true);
    try {
      await updateOrderStatus(orderId, "in_progress");
      await loadOrders();
    } catch (error) {
      console.error("Failed to start order:", error);
      alert("Failed to start order. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by buyer/seller
    if (filter === "buying" && order.buyer_id !== currentUser.id) return false;
    if (filter === "selling" && order.seller_id !== currentUser.id)
      return false;

    // Filter by status
    if (statusFilter !== "all" && order.status !== statusFilter) return false;

    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FontAwesomeIcon icon={faClock} className="text-yellow-500" />;
      case "in_progress":
        return <FontAwesomeIcon icon={faSpinner} className="text-blue-500" />;
      case "delivered":
        return <FontAwesomeIcon icon={faTruck} className="text-purple-500" />;
      case "completed":
        return (
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
        );
      case "cancelled":
        return (
          <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
        );
      case "revision":
        return <FontAwesomeIcon icon={faUndo} className="text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "revision":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-bg) py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-(--color-text) flex items-center gap-2">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="text-(--color-primary)"
            />
            My Orders
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-(--color-surface) rounded-lg p-4 mb-6 shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === "all"
                    ? "bg-(--color-primary) text-white"
                    : "bg-(--color-bg) text-(--color-text) hover:bg-opacity-80"
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilter("buying")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === "buying"
                    ? "bg-(--color-primary) text-white"
                    : "bg-(--color-bg) text-(--color-text) hover:bg-opacity-80"
                }`}
              >
                Buying
              </button>
              <button
                onClick={() => setFilter("selling")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === "selling"
                    ? "bg-(--color-primary) text-white"
                    : "bg-(--color-bg) text-(--color-text) hover:bg-opacity-80"
                }`}
              >
                Selling
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="revision">Revision</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-(--color-surface) rounded-lg">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="text-6xl text-(--color-text-muted) mb-4"
            />
            <p className="text-xl text-(--color-text-muted)">No orders found</p>
            <Link
              to="/browse-gigs"
              className="inline-block mt-4 px-6 py-3 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              Browse Gigs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isBuyer = order.buyer_id === currentUser.id;
              const otherParty = isBuyer ? order.seller : order.buyer;

              return (
                <div
                  key={order.id}
                  className="bg-(--color-surface) rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Gig Image */}
                    <img
                      src={getImageUrl(order.gig.image_url)}
                      alt={order.gig.title}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />

                    {/* Order Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-(--color-text) mb-1">
                            {order.gig.title}
                          </h3>
                          <p className="text-sm text-(--color-text-muted)">
                            {isBuyer ? "Seller" : "Buyer"}: @
                            {otherParty.profile.username}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-500">
                            Free
                          </p>
                          <p className="text-sm text-(--color-text-muted) capitalize">
                            {order.package_type}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-(--color-text-muted) mb-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                          >
                            {order.status.replace("_", " ")}
                          </span>
                        </div>
                        <div>Delivery: {order.delivery_time} days</div>
                        <div>
                          Ordered:{" "}
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {/* Seller Actions */}
                        {!isBuyer && order.status === "pending" && (
                          <button
                            onClick={() => handleStartOrder(order.id)}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                          >
                            Start Order
                          </button>
                        )}

                        {!isBuyer &&
                          (order.status === "in_progress" ||
                            order.status === "revision") && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowDeliveryModal(true);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                            >
                              {order.status === "revision"
                                ? "Re-deliver"
                                : "Deliver Order"}
                            </button>
                          )}

                        {/* Buyer Actions */}
                        {isBuyer && order.status === "delivered" && (
                          <>
                            <button
                              onClick={() => handleAcceptDelivery(order.id)}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
                            >
                              Accept Delivery
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowRevisionModal(true);
                              }}
                              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                            >
                              Request Revision
                            </button>
                          </>
                        )}

                        {/* View Details */}
                        <Link
                          to={`/order/${order.id}`}
                          className="px-4 py-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) rounded-lg hover:bg-opacity-80 transition-all"
                        >
                          View Details
                        </Link>

                        {/* Message */}
                        <Link
                          to={`/messages?user=${otherParty.id}`}
                          className="px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all"
                        >
                          Message {isBuyer ? "Seller" : "Buyer"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delivery Modal */}
      {showDeliveryModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-surface) rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-(--color-text) mb-4">
              Deliver Order
            </h2>
            <textarea
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="Add delivery notes for the buyer..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary) mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDeliverOrder}
                disabled={actionLoading || !deliveryNote.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
              >
                {actionLoading ? "Delivering..." : "Deliver"}
              </button>
              <button
                onClick={() => {
                  setShowDeliveryModal(false);
                  setDeliveryNote("");
                }}
                className="flex-1 px-4 py-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) rounded-lg hover:bg-opacity-80 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-surface) rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-(--color-text) mb-4">
              Request Revision
            </h2>
            <textarea
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              placeholder="Explain what needs to be revised..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary) mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleRequestRevision}
                disabled={actionLoading || !revisionReason.trim()}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-all"
              >
                {actionLoading ? "Requesting..." : "Request Revision"}
              </button>
              <button
                onClick={() => {
                  setShowRevisionModal(false);
                  setRevisionReason("");
                }}
                className="flex-1 px-4 py-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) rounded-lg hover:bg-opacity-80 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
