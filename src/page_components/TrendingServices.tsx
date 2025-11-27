import Button from "../components/Button";
import UserCard from "./../components/UsersCard.tsx";
import users from "../utils/UserDetails.tsx";
import { Link } from "react-router-dom";

function TrendingServices() {
  return (
    <article className="flex justify-center items-center flex-wrap gap-4 bg-(--color-bg) p-2.5">
      <section className="w-full flex justify-between items-center pl-6 pr-6 mb-6">
        <div className="flex flex-col justify-start items-start gap-2">
          <p className="section-title text-(--color-text)">Trending Services</p>
          <span className="small-title text-(--color-text)">Most popular gigs this week</span>
        </div>
        <Link to="/browsegigs">
          <Button
            text="View all >"
            bgColor="bg-(--color-primary)"
            textColor="var(--color-text)"
            backdropColor=""
          />
        </Link>
      </section>
      {users.map((user) => (
        <UserCard
          key={user.user_id}
          username={user.username}
          description={user.description}
          rating={user.rating}
          star_icon={user.star_icon}
          rating_number={user.rating_number}
          charge={user.charge}
          user_background_img={user.user_background_img}
          user_profile_img={user.user_profile_img}
          user_id={""}
        />
      ))}
    </article>
  );
}

export default TrendingServices;
