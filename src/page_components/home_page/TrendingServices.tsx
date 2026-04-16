import Button from "../../components/btns/Button.tsx";
import UserCard from "../../components/cards/UsersCard.tsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGigs, type Gig } from "../../API/gigs/getGigs.tsx";
import { getAvatarUrl, getImageUrl } from "../../utils/imageUrl";

function TrendingServices() {
  const [trendingGigs, setTrendingGigs] = useState<Gig[]>([]);

  useEffect(() => {
    const loadTrendingGigs = async () => {
      try {
        const thisWeekResponse = await fetchGigs({
          sort_by: "created_at",
          sort_order: "desc",
        });

        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);

        const weeklyTop = thisWeekResponse.data
          .filter((gig) => new Date(gig.created_at) >= weekAgo)
          .sort((a, b) => {
            const ratingA = Number(a.rating) || 0;
            const ratingB = Number(b.rating) || 0;
            if (ratingB !== ratingA) return ratingB - ratingA;
            return b.review_count - a.review_count;
          })
          .slice(0, 4);

        if (weeklyTop.length > 0) {
          setTrendingGigs(weeklyTop);
          return;
        }

        // Fallback to top rated gigs if there are no weekly gigs
        const topRatedResponse = await fetchGigs({
          sort_by: "rating",
          sort_order: "desc",
        });

        setTrendingGigs(topRatedResponse.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load trending gigs:", error);
      }
    };

    loadTrendingGigs();
  }, []);

  return (
    <article className="flex justify-center items-center flex-wrap gap-4 bg-(--color-bg) p-2.5">
      <section className="w-full flex justify-between items-center pl-6 pr-6 mb-6">
        <div className="flex flex-col justify-start items-start gap-2">
          <p className="section-title text-(--color-text)">Trending Services</p>
          <span className="small-title text-(--color-text)">
            Most popular gigs this week
          </span>
        </div>
        <Link to="/browse-gigs">
          <Button
            text="View all >"
            bgColor="bg-(--color-primary)"
            textColor="text-[var(--color-text)]"
            backdropColor=""
          />
        </Link>
      </section>
      {trendingGigs.map((gig) => (
        <Link to={`/gig/${gig.id}`} key={gig.id}>
          <UserCard
            username={gig.seller.name}
            sellerUsername={gig.seller.profile?.username}
            description={gig.title}
            rating={gig.rating}
            star_icon="⭐"
            rating_number={gig.review_count.toString()}
            charge={`$${gig.price}`}
            user_background_img={getImageUrl(gig.image_url)}
            user_profile_img={getAvatarUrl(
              gig.seller.profile?.avatar_url || gig.seller.image,
            )}
            user_id={gig.seller_id.toString()}
            category={gig.category?.name}
          />
        </Link>
      ))}
    </article>
  );
}

export default TrendingServices;
