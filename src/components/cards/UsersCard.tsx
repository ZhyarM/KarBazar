import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { User } from "../utils/UserDetails";
import { faCode } from "@fortawesome/free-solid-svg-icons";

function UsersCard({
  username,
  description,
  rating,
  star_icon,
  rating_number,
  charge,
  user_background_img,
  user_profile_img,
}: User) {
  return (
    <>
      <div
        className="
    group
    flex flex-col
    gap-6
    py-6
    w-[354.2px] h-[429.6px]
    min-w-0 min-h-0
    font-inter text-base leading-6
    text-left
    text-(--color-text)
    bg-(--color-card) border-(--color-border)
    rounded-xl
    shadow-xl
    overflow-hidden
    transition cursor-pointer hover:bg-(--color-card-hover) hover:-translate-y-2 
    border border-( --color-border)"
      >
        {user_background_img ? (
          <img
            src={user_background_img}
            className="w-full h-48 object-cover"
            alt={username}
          />
        ) : (
          <div className="w-full h-48 flex justify-center items-center bg-(image:--gradient-secondary) text-3xl">
            <FontAwesomeIcon icon={faCode} />
          </div>
        )}

        <div className="flex justify-start items-center gap-1.5 px-6">
          {user_profile_img ? (
            <img
              src={user_profile_img}
              alt={username}
              className="
        w-8 h-8
        rounded-full
        object-cover object-center
      "/>
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
              {username.charAt(0).toUpperCase()}
            </span>
          )}

          <p className="text-(--color-text)">{username}</p>
        </div>

        <p className="text-(--color-text) px-6 transition-colors duration-300 group-hover:text-(--color-primary)">
          {description}
        </p>
        <div className="flex justify-between items-center px-6">
          <div className="flex justify-start items-center gap-1.5">
            <span className="text-amber-300">{star_icon}</span>
            <span>{rating}</span>
            <span>({rating_number})</span>
          </div>

          <p className="text-(--color-text)">{charge}</p>
        </div>
      </div>
    </>
  );
}

export default UsersCard;
