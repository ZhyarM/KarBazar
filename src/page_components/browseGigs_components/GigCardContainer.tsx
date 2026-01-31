import { useState, useEffect } from "react";
import Button from "../../components/btns/Button.tsx";
import UserCard from "../../components/cards/UsersCard.tsx";
import { Link } from "react-router-dom";
import { type Gig } from "../../API/gigs/getGigs.tsx";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface GigCardProps {
  users: Gig[];
  activeFilters: Record<string, any>;
}

function GigCard({ users, activeFilters }: GigCardProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const userCardPerPage = 8;
  const totalPages = Math.ceil(users.length / userCardPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [users]);

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

  const prevPageHandler = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const nextPageHandler = (activePage?: number) => {
    if (activePage !== undefined) {
      if (
        activePage >= 1 &&
        activePage <= totalPages &&
        activePage !== currentPage
      ) {
        setCurrentPage(activePage);
      }
      return;
    }
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <article className="flex flex-col items-center justify-center gap-5 w-full">
      {users.length > 0 ? (
        <>
          <section className="w-full flex flex-wrap justify-center gap-4">
            {users
              .slice(
                currentPage * userCardPerPage - userCardPerPage,
                currentPage * userCardPerPage
              )
              .map((user) => (
                <Link to={`/user/${user.seller_id}`} key={user.id}>
                  <UserCard
                    username={user.seller.profile.username}
                    description={user.description}
                    rating={user.rating}
                    rating_number={user.seller.profile.rating}
                    charge={user.price.toString()}
                    user_background_img={user.image_url || ""}
                    user_profile_img={user.image_url || ""}
                    user_id={user.seller_id.toString()}
                  /> 
                </Link>
              ))}
          </section>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2.5 mt-4">
              {currentPage > 1 && (
                <Button
                  onClick={prevPageHandler}
                  text="Prev"
                  bgColor="bg-(--color-bg-inverse)"
                  textColor="text-(--color-text-inverse)"
                  backdropColor=""
                />
              )}

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={`page-btn-${i}`}
                  onClick={() => nextPageHandler(i + 1)}
                  text={`${i + 1}`}
                  bgColor={
                    currentPage === i + 1
                      ? "bg-(--color-primary)"
                      : "bg-(--color-bg-inverse)"
                  }
                  textColor="text-(--color-text-inverse)"
                  backdropColor=""
                />
              ))}

              {currentPage < totalPages && (
                <Button
                  onClick={() => nextPageHandler()}
                  text="Next"
                  bgColor="bg-(--color-bg-inverse)"
                  textColor="text-(--color-text-inverse)"
                  backdropColor=""
                />
              )}
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
            No results match these filters:
          </p>
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
        </div>
      )}
    </article>
  );
}

export default GigCard;
