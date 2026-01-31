import { useState, useEffect } from "react";
import Button from "../../components/btns/Button.tsx";
import UserCard from "../../components/cards/UsersCard.tsx";
import { Link } from "react-router-dom";
import { type Gig , type GigResponse} from "../../API/gigs/getGigs.tsx";
import { faStar } from "@fortawesome/free-solid-svg-icons";


interface GigCardProps {
  response:GigResponse
  activeFilters: Record<string, any>;
  pageNumber: number;
  onPageChange?: (newPage: number) => void;
}

function GigCard({ response, activeFilters, pageNumber, onPageChange}: GigCardProps) {
  
  const userCardPerPage = response.meta.per_page;
  const users = response.data;
  const totalPages = response.meta.total;

  

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
    if (pageNumber > 1 && onPageChange) {
      onPageChange(pageNumber - 1);
    }
  };

  const nextPageHandler = (targetPage?:number) => {
    if (!onPageChange) return;
    if(targetPage!== undefined){
      onPageChange(targetPage);
    }else{
      onPageChange(pageNumber + 1); 
    }
  };

  return (
    <article className="flex flex-col items-center justify-center gap-5 w-full">
      {users.length > 0 ? (
        <>
          <section className="w-full flex flex-wrap justify-center gap-4">
            {users.map((user) => (
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
            <div className="flex items-center justify-center gap-4 mt-4">
              {pageNumber > 1 && (
                <Button onClick={prevPageHandler} text="Previous" bgColor="bg-(--color-accent)" />
              )}

              {(() => {
                const buttons = [];
                const maxVisible = pageNumber + 3; 
                const startpage = Math.max(1, pageNumber - 2);
                
                  for (let i = startpage; i <= Math.min(maxVisible, totalPages); i++) {
                    
                    buttons.push(
                      <Button
                        key={i}
                        onClick={() => nextPageHandler(i)}
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

                if (totalPages > maxVisible) {
                  if (totalPages > maxVisible + 1) {
                    buttons.push(
                      <Button onClick={()=>nextPageHandler(pageNumber+1)} text="bext" bgColor="bg-(--color-accent)" />,
                    );
                  }

                  buttons.push(
                    <Button
                      key={totalPages}
                      onClick={() => nextPageHandler(totalPages)}
                      text={`${totalPages}`}
                      bgColor={
                        pageNumber === totalPages
                          ? "bg-(--color-primary)"
                          : "bg-(--color-bg-inverse)"
                      }
                      textColor="text-(--color-text-inverse)"
                    />,
                  );
                }

                {
                  pageNumber < totalPages && (
                    <Button onClick={()=>nextPageHandler()} text="Next" />
                  )
                }




                return buttons;
              })()}
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
