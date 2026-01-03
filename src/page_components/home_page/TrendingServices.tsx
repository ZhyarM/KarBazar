import Button from "../../components/btns/Button.tsx";
import UserCard from "../../components/cards/UsersCard.tsx";
import users from "../../utils/UserData.tsx";
import { Link } from "react-router-dom";

function TrendingServices() {
  return (
    <article className="flex justify-center items-center flex-wrap gap-4 bg-(--color-bg) p-2.5">
      <section className="w-full flex justify-between items-center pl-6 pr-6 mb-6">
        <div className="flex flex-col justify-start items-start gap-2">
          <p className="section-title text-(--color-text)">Trending Services</p>
          <span className="small-title text-(--color-text)">
            Most popular gigs this week
          </span>
        </div>
        <Link to="/browsegigs">
          <Button
            text="View all >"
            bgColor="bg-(--color-primary)"
            textColor="text-[var(--color-text)]"
            backdropColor=""
          />
        </Link>
      </section>
      {users.slice(0, 4).map((user) => (
        <Link to={`/user/${user.user_id}`} key={user.user_id}>
        <UserCard
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
        </Link>
      ))}
    </article>
  );
}

export default TrendingServices;
