import { useEffect, useState } from "react";
import {
  deleteAdminReview,
  getAdminReviews,
  type AdminReview,
} from "../../API/AdminAPI";
import { useLanguage } from "../../context/LanguageContext";

function AdminReviewsPage() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getAdminReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm(t("admin.reviews.confirmDelete"))) {
      return;
    }

    try {
      await deleteAdminReview(reviewId);
      await loadReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert(
        error instanceof Error
          ? error.message
          : t("admin.reviews.deleteFailed"),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text)">
          {t("admin.reviews.title")}
        </h2>
        <p className="text-(--color-text-muted) mt-2">
          {t("admin.reviews.subtitle")}
        </p>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-(--color-primary)"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-(--color-border) rounded-md p-3 bg-(--color-bg)"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-(--color-text)">
                      {review.reviewer?.name || t("admin.reviews.unknown")}{" "}
                      {"->"}{" "}
                      {review.reviewee?.name || t("admin.reviews.unknown")}
                    </p>
                    <p className="text-sm text-(--color-text-muted)">
                      {t("admin.reviews.rating")}: {review.rating}/5 |{" "}
                      {t("admin.reviews.gig")}:{" "}
                      {review.gig?.title || t("admin.reviews.notAvailable")}
                    </p>
                    <p className="text-sm text-(--color-text) mt-2">
                      {review.comment || t("admin.reviews.noComment")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    className="px-3 py-1 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm"
                  >
                    {t("admin.reviews.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReviewsPage;
