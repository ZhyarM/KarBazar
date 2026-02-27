import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSpinner,
  faClock,
  faPlay,
  faTruck,
  faCheckCircle,
  faTimesCircle,
  faUndo,
  faMessage,
  faStar,
  faFileAlt,
  faCalendar,
  faUser,
  faShoppingBag,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import {
  getOrder,
  updateOrderStatus,
  acceptDelivery,
  requestRevision,
} from "../API/OrdersAPI";
import { createReview } from "../API/ReviewsAPI";
import type { Order } from "../API/OrdersAPI";
import { getImageUrl, getAvatarUrl } from "../utils/imageUrl";

type OrderStatus =
  | "pending"
  | "in_progress"
  | "delivered"
  | "revision"
  | "completed"
  | "cancelled";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; icon: any }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    icon: faClock,
  },
  in_progress: {
    label: "In Progress",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: faPlay,
  },
  delivered: {
    label: "Delivered",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    icon: faTruck,
  },
  revision: {
    label: "Revision Requested",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    icon: faUndo,
  },
  completed: {
    label: "Completed",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: faCheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-100",
    icon: faTimesCircle,
  },
};

const TIMELINE_STEPS: OrderStatus[] = [
  "pending",
  "in_progress",
  "delivered",
  "completed",
];

function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Delivery modal
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState("");

  // Revision modal
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionReason, setRevisionReason] = useState("");

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewDone, setReviewDone] = useState(false);

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrder(Number(id));
      setOrder(data);
      // Check if review already exists
      if ((data as any).review) {
        setReviewDone(true);
      }
    } catch (err) {
      setError("Failed to load order details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isBuyer = order?.buyer_id === currentUser.id;
  const isSeller = order?.seller_id === currentUser.id;
  const otherParty = isBuyer ? order?.seller : order?.buyer;
  const status = (order?.status || "pending") as OrderStatus;
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  const handleStartOrder = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      await updateOrderStatus(order.id, "in_progress");
      await loadOrder();
    } catch {
      alert("Failed to start order.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliver = async () => {
    if (!order || !deliveryNote.trim()) return;
    setActionLoading(true);
    try {
      await updateOrderStatus(order.id, "delivered", deliveryNote);
      setShowDeliveryModal(false);
      setDeliveryNote("");
      await loadOrder();
    } catch {
      alert("Failed to deliver order.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      await acceptDelivery(order.id);
      await loadOrder();
    } catch {
      alert("Failed to accept delivery.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevision = async () => {
    if (!order || !revisionReason.trim()) return;
    setActionLoading(true);
    try {
      await requestRevision(order.id, revisionReason);
      setShowRevisionModal(false);
      setRevisionReason("");
      await loadOrder();
    } catch {
      alert("Failed to request revision.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!order) return;
    setReviewError("");
    setReviewSubmitting(true);
    try {
      await createReview(
        order.id,
        order.gig_id,
        order.seller_id,
        reviewRating,
        reviewComment,
      );
      setReviewDone(true);
      setShowReviewForm(false);
    } catch (err: any) {
      setReviewError(
        err?.message ||
          "Failed to submit review. You may have already reviewed this order.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const getTimelineIndex = (): number => {
    if (status === "cancelled") return -1;
    if (status === "revision") return 2; // Between delivered and completed
    return TIMELINE_STEPS.indexOf(status);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-(--color-bg)">
        <div className="flex flex-col items-center gap-4">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl text-(--color-primary) animate-spin"
          />
          <p className="text-(--color-text-muted)">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-(--color-bg)">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">
            {error || "Order not found"}
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-bg) py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="text-(--color-text-muted) hover:text-(--color-primary) transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-(--color-text)">
              Order #{order.id}
            </h1>
            <p className="text-sm text-(--color-text-muted)">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${statusConfig.bgColor} ${statusConfig.color}`}
          >
            <FontAwesomeIcon icon={statusConfig.icon} />
            {statusConfig.label}
          </div>
        </div>

        {/* Progress Timeline */}
        {status !== "cancelled" && (
          <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-(--color-text-muted) mb-6 uppercase tracking-wide">
              Order Progress
            </h3>
            <div className="flex items-center justify-between relative">
              {/* Background Line */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-(--color-border) rounded-full" />
              {/* Active Line */}
              <div
                className="absolute top-5 left-8 h-1 bg-(--color-primary) rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(0, (getTimelineIndex() / (TIMELINE_STEPS.length - 1)) * (100 - 10))}%`,
                }}
              />
              {TIMELINE_STEPS.map((step, idx) => {
                const stepConfig = STATUS_CONFIG[step];
                const currentIdx = getTimelineIndex();
                const isActive = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div
                    key={step}
                    className="flex flex-col items-center z-10 relative"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-3 transition-all ${
                        isCurrent
                          ? "bg-(--color-primary) border-(--color-primary) text-white scale-110 shadow-lg"
                          : isActive
                            ? "bg-(--color-primary) border-(--color-primary) text-white"
                            : "bg-(--color-surface) border-(--color-border) text-(--color-text-muted)"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={stepConfig.icon}
                        className="text-sm"
                      />
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isActive
                          ? "text-(--color-text)"
                          : "text-(--color-text-muted)"
                      }`}
                    >
                      {stepConfig.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {status === "revision" && (
              <div className="mt-4 flex items-center gap-2 text-orange-600 text-sm bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
                <FontAwesomeIcon icon={faUndo} />
                <span>Revision requested — seller needs to re-deliver.</span>
              </div>
            )}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Gig Card */}
            <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                <Link to={`/gig/${order.gig_id}`}>
                  <img
                    src={getImageUrl(order.gig?.image_url)}
                    alt={order.gig?.title}
                    className="w-full sm:w-40 h-28 object-cover rounded-lg hover:opacity-80 transition"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    to={`/gig/${order.gig_id}`}
                    className="text-lg font-bold text-(--color-text) hover:text-(--color-primary) transition"
                  >
                    {order.gig?.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-2 text-sm text-(--color-text-muted)">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCalendar} />
                      {order.delivery_time} day delivery
                    </span>
                    <span className="text-lg font-bold text-green-500">
                      Free
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {order.requirements && (
              <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-(--color-text) mb-3 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="text-(--color-primary)"
                  />
                  Requirements
                </h3>
                <div className="text-(--color-text) text-sm whitespace-pre-line leading-relaxed bg-(--color-bg) rounded-lg p-4 border border-(--color-border)">
                  {order.requirements}
                </div>
              </div>
            )}

            {/* Delivery Note */}
            {order.delivery_note && (
              <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-(--color-text) mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTruck} className="text-purple-500" />
                  Delivery Note
                </h3>
                <div className="text-(--color-text) text-sm whitespace-pre-line leading-relaxed bg-(--color-bg) rounded-lg p-4 border border-(--color-border)">
                  {order.delivery_note}
                </div>
              </div>
            )}

            {/* Delivery Files */}
            {order.delivery_files && (
              <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-(--color-text) mb-3 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="text-green-500"
                  />
                  Delivery Files
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(typeof order.delivery_files === "string"
                    ? JSON.parse(order.delivery_files)
                    : order.delivery_files
                  ).map((file: any, idx: number) => {
                    const fileUrl =
                      typeof file === "string" ? file : file.url || file;
                    const fileName =
                      typeof file === "object" && file.name
                        ? file.name
                        : `File ${idx + 1}`;
                    return (
                      <a
                        key={idx}
                        href={getImageUrl(fileUrl) || fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-(--color-bg) border border-(--color-border) rounded-lg text-sm text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition"
                      >
                        <FontAwesomeIcon icon={faFileAlt} />
                        {fileName}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions Section */}
            <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-(--color-text) mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                {/* Seller: Start Order */}
                {isSeller && status === "pending" && (
                  <button
                    onClick={handleStartOrder}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPlay} />
                    {actionLoading ? "Starting..." : "Start Order"}
                  </button>
                )}

                {/* Seller: Deliver / Re-deliver */}
                {isSeller &&
                  (status === "in_progress" || status === "revision") && (
                    <button
                      onClick={() => setShowDeliveryModal(true)}
                      className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTruck} />
                      {status === "revision" ? "Re-deliver" : "Deliver Order"}
                    </button>
                  )}

                {/* Buyer: Accept Delivery */}
                {isBuyer && status === "delivered" && (
                  <button
                    onClick={handleAccept}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    {actionLoading ? "Accepting..." : "Accept Delivery"}
                  </button>
                )}

                {/* Buyer: Request Revision */}
                {isBuyer && status === "delivered" && (
                  <button
                    onClick={() => setShowRevisionModal(true)}
                    className="px-5 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faUndo} />
                    Request Revision
                  </button>
                )}

                {/* Message other party */}
                <Link
                  to={`/messages/${otherParty?.id}`}
                  className="px-5 py-2.5 bg-(--color-primary) text-white font-semibold rounded-lg hover:opacity-90 transition flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faMessage} />
                  Message {isBuyer ? "Seller" : "Buyer"}
                </Link>

                {/* No actions for completed/cancelled */}
                {(status === "completed" || status === "cancelled") &&
                  !isBuyer && (
                    <p className="text-(--color-text-muted) text-sm self-center">
                      This order is {status}. No further actions available.
                    </p>
                  )}
              </div>
            </div>

            {/* Review Section - Only for buyer after completion */}
            {isBuyer && status === "completed" && (
              <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-(--color-text) mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                  Review
                </h3>

                {reviewDone || (order as any).review ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    {(order as any).review ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              className={
                                i < ((order as any).review.rating || 0)
                                  ? "text-amber-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        {(order as any).review.comment && (
                          <p className="text-(--color-text) text-sm">
                            "{(order as any).review.comment}"
                          </p>
                        )}
                        <p className="text-green-700 text-sm font-medium">
                          Review submitted
                        </p>
                      </div>
                    ) : (
                      <p className="text-green-700 font-medium">
                        Your review has been submitted. Thank you!
                      </p>
                    )}
                  </div>
                ) : !showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full py-3 bg-(--color-primary) text-white font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    Write a Review
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-(--color-text-muted)">
                      How was your experience?
                    </p>
                    {/* Stars */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setReviewHover(star)}
                          onMouseLeave={() => setReviewHover(0)}
                          className="text-3xl transition-transform hover:scale-110"
                        >
                          <FontAwesomeIcon
                            icon={faStar}
                            className={
                              star <= (reviewHover || reviewRating)
                                ? "text-amber-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                      <span className="text-sm text-(--color-text-muted) self-center ml-2">
                        {reviewRating}/5
                      </span>
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Tell us about your experience..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary) resize-none"
                    />
                    {reviewError && (
                      <p className="text-red-500 text-sm">{reviewError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={handleSubmitReview}
                        disabled={reviewSubmitting}
                        className="px-6 py-2.5 bg-(--color-primary) text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition"
                      >
                        {reviewSubmitting ? "Submitting..." : "Submit Review"}
                      </button>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="px-6 py-2.5 bg-(--color-bg) text-(--color-text) border border-(--color-border) rounded-lg hover:opacity-80 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Order Summary Card */}
            <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-(--color-text) mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faShoppingBag}
                  className="text-(--color-primary)"
                />
                Order Summary
              </h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-(--color-text-muted)">Order ID</span>
                  <span className="font-semibold text-(--color-text)">
                    #{order.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--color-text-muted)">Status</span>
                  <span className={`font-semibold ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--color-text-muted)">Price</span>
                  <span className="font-bold text-green-500 text-lg">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--color-text-muted)">
                    Delivery Time
                  </span>
                  <span className="text-(--color-text)">
                    {order.delivery_time} days
                  </span>
                </div>
                <hr className="border-(--color-border)" />
                <div className="flex justify-between">
                  <span className="text-(--color-text-muted)">Ordered</span>
                  <span className="text-(--color-text)">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                {order.completed_at && (
                  <div className="flex justify-between">
                    <span className="text-(--color-text-muted)">Completed</span>
                    <span className="text-(--color-text)">
                      {new Date(order.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Other Party Card */}
            {otherParty && (
              <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-(--color-text) mb-4 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-(--color-primary)"
                  />
                  {isBuyer ? "Seller" : "Buyer"}
                </h3>
                <div className="flex items-center gap-3">
                  {otherParty.profile?.avatar_url ? (
                    <img
                      src={getAvatarUrl(otherParty.profile.avatar_url)}
                      alt={otherParty.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-(--color-border)"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-(--color-bg-muted) flex items-center justify-center font-bold text-(--color-text)">
                      {otherParty.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-(--color-text) truncate">
                      {otherParty.name}
                    </p>
                    <p className="text-sm text-(--color-text-muted) truncate">
                      @{otherParty.profile?.username || "user"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/profile/${otherParty.profile?.username}`}
                    className="flex-1 text-center px-3 py-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) rounded-lg text-sm font-medium hover:opacity-80 transition"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/messages/${otherParty.id}`}
                    className="flex-1 text-center px-3 py-2 bg-(--color-primary) text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                  >
                    Message
                  </Link>
                </div>
              </div>
            )}

            {/* Status Info */}
            {status === "pending" && isBuyer && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                Waiting for the seller to start working on your order.
              </div>
            )}
            {status === "pending" && isSeller && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-2"
                />
                You have a new order! Start working on it to begin the delivery
                countdown.
              </div>
            )}
            {status === "in_progress" && isSeller && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                You're working on this order. Deliver when ready.
              </div>
            )}
            {status === "delivered" && isBuyer && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800">
                <FontAwesomeIcon icon={faTruck} className="mr-2" />
                The seller has delivered! Review it and accept or request a
                revision.
              </div>
            )}
            {status === "revision" && isSeller && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
                <FontAwesomeIcon icon={faUndo} className="mr-2" />
                The buyer requested a revision. Please re-deliver when ready.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-surface) rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-(--color-text) mb-4">
              {status === "revision" ? "Re-deliver Order" : "Deliver Order"}
            </h2>
            <textarea
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="Add delivery notes for the buyer..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary) mb-4 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDeliver}
                disabled={actionLoading || !deliveryNote.trim()}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
              >
                {actionLoading ? "Delivering..." : "Deliver"}
              </button>
              <button
                onClick={() => {
                  setShowDeliveryModal(false);
                  setDeliveryNote("");
                }}
                className="flex-1 px-4 py-2.5 bg-(--color-bg) text-(--color-text) border border-(--color-border) rounded-lg hover:opacity-80 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-surface) rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-(--color-text) mb-4">
              Request Revision
            </h2>
            <textarea
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              placeholder="Explain what needs to be revised..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary) mb-4 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleRevision}
                disabled={actionLoading || !revisionReason.trim()}
                className="flex-1 px-4 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
              >
                {actionLoading ? "Requesting..." : "Request Revision"}
              </button>
              <button
                onClick={() => {
                  setShowRevisionModal(false);
                  setRevisionReason("");
                }}
                className="flex-1 px-4 py-2.5 bg-(--color-bg) text-(--color-text) border border-(--color-border) rounded-lg hover:opacity-80 transition"
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

export default OrderDetails;
