import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faStar } from "@fortawesome/free-solid-svg-icons";

interface UserCardProps {
  user_id: string;
  username: string;
  sellerUsername?: string;
  description: string;
  rating: string;
  rating_number: string;
  star_icon?: string | React.ReactNode;
  charge: string;
  user_background_img?: string;
  user_profile_img?: string;
  category?: string;
}

function UsersCard({
  username,
  sellerUsername,
  description,
  rating,
  star_icon,
  rating_number,
  charge,
  user_background_img,
  user_profile_img,
  category,
}: UserCardProps) {
  return (
    <div
      className="
        group flex flex-col
        w-full max-w-[340px] min-w-[280px]
        font-inter text-base leading-6 text-left
        text-(--color-text)
        bg-(--color-card) border border-(--color-border)
        rounded-xl shadow-md overflow-hidden
        transition-all duration-300 cursor-pointer
        hover:bg-(--color-card-hover) hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Gig Image */}
      {user_background_img ? (
        <img
          src={user_background_img}
          className="w-full h-44 object-cover"
          alt={description}
        />
      ) : (
        <div className="w-full h-44 flex justify-center items-center bg-(image:--gradient-secondary) text-3xl">
          <FontAwesomeIcon icon={faCode} />
        </div>
      )}

      <div className="flex flex-col gap-3 p-4">
        {/* Seller Info */}
        <div className="flex items-center gap-2.5">
          {user_profile_img ? (
            <img
              src={user_profile_img}
              alt={username}
              className="w-9 h-9 rounded-full object-cover object-center border-2 border-(--color-border) flex-shrink-0"
            />
          ) : (
            <span
              className="
                flex items-center justify-center
                w-9 h-9 flex-shrink-0
                font-inter text-sm font-semibold leading-5
                text-(--color-text)
                rounded-full
                bg-(image:--gradient-secondary)"
            >
              {username.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-(--color-text) truncate">
              {username}
            </p>
            {sellerUsername && (
              <p className="text-xs text-(--color-text-muted) truncate">
                @{sellerUsername}
              </p>
            )}
          </div>
        </div>

        {/* Gig Title */}
        <p className="text-sm text-(--color-text) line-clamp-2 min-h-[40px] transition-colors duration-300 group-hover:text-(--color-primary)">
          {description}
        </p>

        {/* Category Badge */}
        {category && (
          <span className="self-start text-xs px-2 py-0.5 rounded-full bg-(--color-primary)/10 text-(--color-primary) font-medium">
            {category}
          </span>
        )}

        {/* Rating & Price */}
        <div className="flex justify-between items-center pt-2 border-t border-(--color-border)">
          <div className="flex items-center gap-1">
            <span className="text-amber-400 text-sm">
              {star_icon || <FontAwesomeIcon icon={faStar} />}
            </span>
            <span className="text-sm font-semibold text-(--color-text)">
              {rating}
            </span>
            <span className="text-xs text-(--color-text-muted)">
              ({rating_number})
            </span>
          </div>
          <p className="text-sm font-bold text-(--color-text)">
            Starting at <span className="text-(--color-primary)">{charge}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UsersCard;
