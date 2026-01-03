import { useParams } from "react-router-dom";
import users from "../../utils/UserData";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

function UserDetails() {
  const { userId } = useParams<{ userId: string }>();
  const user = users.find((u) => u.user_id === userId);

  return (
    <>
      <article className="w-full h-full flex gap-3 bg-(--color-bg) py-3 px-10">
        <section className="flex flex-col gap-2.5">
          <h1 className="section-title text-(--color-text)">
            {user?.description}
          </h1>

          <div className="flex justify-start items-center gap-2">
            <span className="text-xs text-(--color-text) bg-(--color-primary) px-1.5 py-2 rounded-md">
              {user?.category}
            </span>
            <span className="text-xs text-(--color-text) bg-(--color-bg-muted) px-1.5 py-2 rounded-md">
              {user?.subcategory}
            </span>
          </div>

          <div className="flex justify-start items-center gap-6">
            <div className="flex items-center gap-2">
              {user?.user_profile_img ? (
                <img
                  src={user?.user_profile_img}
                  alt={user?.username}
                  className="
        w-8 h-8
        rounded-full
        object-cover object-center
      "
                />
              ) : (
                <span
                  className="
        flex items-center justify-center
        w-8 h-8
        font-inter text-sm font-semibold leading-5
        text-(--color-text)
        rounded-full
        bg-(image:--gradient-secondary)
      "
                >
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="flex flex-col ml-1">
                <p className="text-md font-bold text-(--color-text)">
                  {user?.username}
                </p>
                <p className="text-sm text-(--color-text-muted)">
                  {user?.seller_level}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-amber-300 text-lg">{user?.star_icon}</span>
              <span className="text-(--color-text)">{user?.rating}</span>
              <span className="text-(--color-text-muted)">{`(${user?.rating_number} reviews)`}</span>
            </div>
          </div>
          <div className="w-full min-w-0 max-w-full md:max-w-3xl lg:max-w-4xl flex flex-col justify-start gap-2 py-3">
            <div className="flex justify-start gap-2 p-2">
              <Link to={"."} className="group">
                <span className="text-(--color-text) bg-(--color-bg-muted) px-2 py-1 rounded-md transition-all duration-200 group-hover:bg-(--color-primary) group-hover:text-(--color-text-inverse) group-hover:shadow-(--shadow-sm)">
                  Dispcription
                </span>
              </Link>
              <Link to={"reviews"} className="group">
                <span className="text-(--color-text) bg-(--color-bg-muted) px-2 py-1 rounded-md transition-all duration-200 group-hover:bg-(--color-primary) group-hover:text-(--color-text-inverse) group-hover:shadow-(--shadow-sm)">
                  Reviews
                </span>
              </Link>
              <Link to={"faq"} className="group">
                <span className="text-(--color-text) bg-(--color-bg-muted) px-2 py-1 rounded-md transition-all duration-200 group-hover:bg-(--color-primary) group-hover:text-(--color-text-inverse) group-hover:shadow-(--shadow-sm)">
                  FAQ
                </span>
              </Link>
            </div>
            <div className=" flex flex-col gap-3 border border-(--color-border) rounded-md px-6 py-4 shadow-(--shadow-md)">
              <Outlet
                context={{
                  username: user?.username,
                  intro: user?.about?.intro,
                  whatYoullGet: user?.about?.whatYoullGet,
                  technologies: user?.about?.technologies,
                }}
              />
            </div>
          </div>
        </section>
      </article>
    </>
  );
}

export default UserDetails;
