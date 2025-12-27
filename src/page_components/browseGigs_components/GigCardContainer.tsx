import { useState } from "react";
import Button from "../../components/btns/Button.tsx";
import users from "../../utils/UserData.tsx";
import UserCard from "../../components/cards/UsersCard.tsx";
import type { User } from "../../utils/UserData.tsx";
import { Link } from "react-router-dom";

function GigCard() {
  const [user, setUsers] = useState<User[]>([...users]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const userCardPerPage = 8;
  const totalPages = Math.ceil(user.length / userCardPerPage);

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
    <>
      <article className="flex flex-col items-center justify-center gap-5">
        {user.length > 0 && (
          <section className="w-full flex flex-wrap justify-center gap-4">
            {user
              .slice(
                currentPage * userCardPerPage - userCardPerPage,
                currentPage * userCardPerPage
              )
              .map((user) => (
                <Link to={`/user/${user.user_id}`} key={user.user_id}>
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
                </Link>
              ))}
          </section>
        )}

        <div className="flex justify-center items-center gap-2.5">
          {currentPage === 1 ? null : (
            <Button
              onClick={prevPageHandler}
              text="Prev"
              bgColor="bg-(--color-bg-inverse)"
              textColor="text-(--color-text-inverse)"
              backdropColor=""
            />
          )}
          {[...Array(Math.ceil(user.length / userCardPerPage))].map((_, i) => {
            return (
              <Button
                key={`page-btn-${i}`}
                onClick={() => nextPageHandler(i + 1)}
                text={`${i + 1}`}
                bgColor="bg-(--color-bg-inverse)"
                textColor="text-(--color-text-inverse)"
                backdropColor=""
              />
            );
          })}
          {currentPage < Math.ceil(user.length / userCardPerPage) ? (
            <Button
              onClick={() => nextPageHandler()}
              text="Next"
              bgColor="bg-(--color-bg-inverse)"
              textColor="text-(--color-text-inverse)"
              backdropColor=""
            />
          ) : null}
        </div>
      </article>
    </>
  );
}

export default GigCard;
