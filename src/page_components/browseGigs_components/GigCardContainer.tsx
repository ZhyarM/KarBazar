import Button from "../../components/btns/Button.tsx";
import UserCard from "../../components/cards/UsersCard.tsx";
import { Link } from "react-router-dom";
import { type GigResponse } from "../../API/gigs/getGigs.tsx";
import { getImageUrl, getAvatarUrl } from "../../utils/imageUrl";

interface GigCardProps {
  response: GigResponse;
  activeFilters: Record<string, any>;
  pageNumber: number;
  onPageChange?: (newPage: number) => void;
}

function GigCard({
  response,
  activeFilters,
  pageNumber,
  onPageChange,
}: GigCardProps) {
  const gigs = response.data;
  const totalPages = response.meta.last_page;

  const getAppliedFilters = () => {
    const applied = [];
    if (activeFilters.category)
      applied.push(`Category: ${activeFilters.category}`);
    if (activeFilters.sellerLevel)
      applied.push(`Level: ${activeFilters.sellerLevel}`);
    if (activeFilters.budget) {
      const [min, max] = activeFilters.budget;
      if (min > 0 || max < 1000) {
        applied.push(`Budget: $${min} - $${max === 1000 ? "1k+" : max}`);
      }
    }
    if (
      activeFilters.deliveryTime &&
      activeFilters.deliveryTime !== "Anytime"
    ) {
      applied.push(`Delivery: ${activeFilters.deliveryTime}`);
    }
    return applied;
  };

  const appliedList = getAppliedFilters();

  const goToPage = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <article className="flex flex-col items-center justify-center gap-5 w-full">
      {gigs.length > 0 ? (
        <>
          <section className="w-full flex flex-wrap justify-center gap-4">
            {gigs.map((gig) => (
              <Link to={`/gig/${gig.id}`} key={gig.id}>
                <UserCard
                  username={gig.seller.name}
                  sellerUsername={gig.seller.profile?.username}
                  description={gig.title}
                  rating={gig.rating}
                  rating_number={gig.review_count.toString()}
                  charge={`$${gig.price}`}
                  user_background_img={getImageUrl(gig.image_url)}
                  user_profile_img={getAvatarUrl(
                    gig.seller.profile?.avatar_url || gig.seller.image,
                  )}
                  user_id={gig.seller_id.toString()}
                  star_icon="⭐"
                  category={gig.category?.name}
                />
              </Link>
            ))}
          </section>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <Button
                onClick={() => goToPage(pageNumber - 1)}
                text="Previous"
                bgColor={
                  pageNumber <= 1
                    ? "bg-(--color-bg-muted) opacity-50 cursor-not-allowed"
                    : "bg-(--color-accent)"
                }
              />

              {(() => {
                const buttons = [];
                const startPage = Math.max(1, pageNumber - 2);
                const endPage = Math.min(totalPages, pageNumber + 2);

                if (startPage > 1) {
                  buttons.push(
                    <Button
                      key={1}
                      onClick={() => goToPage(1)}
                      text="1"
                      bgColor="bg-(--color-bg-inverse)"
                      textColor="text-(--color-text-inverse)"
                    />,
                  );
                  if (startPage > 2) {
                    buttons.push(
                      <span
                        key="dots-start"
                        className="text-(--color-text-muted) px-1"
                      >
                        ...
                      </span>,
                    );
                  }
                }

                for (let i = startPage; i <= endPage; i++) {
                  buttons.push(
                    <Button
                      key={i}
                      onClick={() => goToPage(i)}
                      text={`${i}`}
                      bgColor={
                        pageNumber === i
                          ? "bg-(--color-primary)"
                          : "bg-(--color-bg-inverse)"
                      }
                      textColor="text-(--color-text-inverse)"
                    />,
                  );
                }

                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    buttons.push(
                      <span
                        key="dots-end"
                        className="text-(--color-text-muted) px-1"
                      >
                        ...
                      </span>,
                    );
                  }
                  buttons.push(
                    <Button
                      key={totalPages}
                      onClick={() => goToPage(totalPages)}
                      text={`${totalPages}`}
                      bgColor="bg-(--color-bg-inverse)"
                      textColor="text-(--color-text-inverse)"
                    />,
                  );
                }

                return buttons;
              })()}

              <Button
                onClick={() => goToPage(pageNumber + 1)}
                text="Next"
                bgColor={
                  pageNumber >= totalPages
                    ? "bg-(--color-bg-muted) opacity-50 cursor-not-allowed"
                    : "bg-(--color-accent)"
                }
              />
            </div>
          )}
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-(--color-surface) border border-dashed border-(--color-border) rounded-xl px-6">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-(--color-text)">
            No Gigs Found
          </h3>
          <p className="text-(--color-text-muted) mb-4">
            {appliedList.length > 0
              ? "No results match these filters:"
              : "No gigs available at the moment."}
          </p>
          {appliedList.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {appliedList.map((filter, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-(--color-primary)/10 text-(--color-primary) text-xs font-medium rounded-full border border-(--color-primary)/20"
                >
                  {filter}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default GigCard;
