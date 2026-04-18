import { useEffect, useState } from "react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getGigReviews, createReview } from "../../API/ReviewsAPI";
import type { Review } from "../../API/ReviewsAPI";
import { getAvatarUrl } from "../../utils/imageUrl";

interface ReviewsProps {
  gigId: number;
  gigRating?: number | string;
  reviewCount?: number;
  /** Pass an order to allow the buyer to write a review */
  completedOrder?: {
    id: number;
    seller_id: number;
    hasReview: boolean;
  } | null;
  onReviewSubmitted?: () => void;
}

function Reviews({
  gigId,
  gigRating,
  reviewCount,
  completedOrder,
  onReviewSubmitted,
}: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(reviewCount ?? 0);
  const [avgRating, setAvgRating] = useState<number>(Number(gigRating) || 0);

  // Review form state
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (gigId) loadReviews();
  }, [gigId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getGigReviews(gigId);
      setReviews(data);
      if (data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAvgRating(Number(avg.toFixed(1)));
      }
      setTotalReviews(data.length);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!completedOrder) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      await createReview(
        completedOrder.id,
        gigId,
        completedOrder.seller_id,
        newRating,
        newComment,
      );
      setSubmitSuccess(true);
      setShowForm(false);
      setNewComment("");
      setNewRating(5);
      await loadReviews();
      onReviewSubmitted?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit review";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-(--color-text)">Reviews</h2>
        <div className="flex items-center gap-2">
          <span className="text-(--color-warning) text-lg">
            <FontAwesomeIcon icon={faStar} />
          </span>
          <span className="text-lg font-semibold text-(--color-text)">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-(--color-text-muted)">
            ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
          </span>
        </div>
      </div>

      {/* Write Review Button/Form */}
      {completedOrder && !completedOrder.hasReview && !submitSuccess && (
        <div className="bg-(--color-bg-muted) border border-(--color-border) rounded-xl p-5">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-3 bg-(--color-primary) text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              Write a Review
            </button>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-(--color-text)">
                Rate your experience
              </h3>
              {/* Star Rating Picker */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition-transform hover:scale-110"
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      className={
                        star <= (hoverRating || newRating)
                          ? "text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-(--color-text-muted) self-center">
                  {newRating}/5
                </span>
              </div>
              {/* Comment */}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this seller..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-(--color-surface) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary) resize-none"
              />
              {submitError && (
                <p className="text-red-500 text-sm">{submitError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="px-6 py-2 bg-(--color-primary) text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSubmitError("");
                  }}
                  className="px-6 py-2 bg-(--color-bg) text-(--color-text) border border-(--color-border) rounded-lg hover:opacity-80 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-medium">
          Your review has been submitted successfully!
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-3 border-(--color-primary) border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-(--color-text-muted)">
          No reviews yet. Be the first to review!
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-(--color-border)">
          {reviews.map((review) => (
            <article key={review.id} className="py-6 flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  {review.reviewer?.profile?.avatar_url ? (
                    <img
                      src={getAvatarUrl(review.reviewer.profile.avatar_url)}
                      alt={review.reviewer.name}
                      className="w-10 h-10 rounded-full object-cover border border-(--color-border)"
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-(--color-bg-muted) flex items-center justify-center font-semibold text-(--color-text)">
                      {review.reviewer?.name?.charAt(0) || "?"}
                    </span>
                  )}
                  <div>
                    <p className="font-semibold text-(--color-text)">
                      {review.reviewer?.name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < review.rating
                              ? "text-(--color-warning)"
                              : "text-(--color-bg-muted)"
                          }
                        >
                          <FontAwesomeIcon icon={faStar} className="text-xs" />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-(--color-text-muted)">
                  {formatTimeAgo(review.created_at)}
                </span>
              </div>
              {review.comment && (
                <p className="text-(--color-text-muted)">{review.comment}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Reviews;
