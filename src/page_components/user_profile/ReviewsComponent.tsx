import { faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { reviewsData } from "../../utils/Comments";
import Button from "./../../components/btns/Button.tsx";

function Reviews() {
  const handleHelpful = (reviewId: string) => {
    console.log("Helpful clicked for review:", reviewId);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-(--color-text)">Reviews</h2>

        <div className="flex items-center gap-2">
          <span className="text-(--color-warning) text-lg"><FontAwesomeIcon icon={faStar} /></span>
          <span className="text-lg font-semibold text-(--color-text)">
            {reviewsData.summary.averageRating}
          </span>
          <span className="text-(--color-text-muted)">
            ({reviewsData.summary.totalReviews} reviews)
          </span>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-(--color-border)">
        {reviewsData.reviews.map((review) => (
          <article key={review.id} className="py-6 flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-(--color-bg-muted) flex items-center justify-center font-semibold text-(--color-text)">
                  {review.name.charAt(0)}
                </span>

                <div>
                  <p className="font-semibold text-(--color-text)">
                    {review.name}
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
                        <FontAwesomeIcon icon={faStar} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <span className="text-sm text-(--color-text-muted)">
                {review.timeAgo}
              </span>
            </div>

            <p className="text-(--color-text-muted)">{review.comment}</p>

            <div className="flex items-center gap-2">
              <Button
                text={`Helpful (${review.helpfulCount})`}
                icon={<FontAwesomeIcon icon={faThumbsUp} />}
                onClick={() => handleHelpful(review.id)}
                textColor="text-(--color-text)"
                hover="hover:text-(--color-accent)"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Reviews;
