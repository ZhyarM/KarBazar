import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faStar } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../context/LanguageContext.tsx";

interface UserCardProps {
  user_id: string;
  username: string;
  sellerUsername?: string;
  description: string;
  rating: string;
  rating_number: string;
  star_icon?: string | React.ReactNode;
  charge: string;
  originalCharge?: string | null;
  discountBadge?: string | null;
  packageDiscounts?: Array<{
    packageLabel: string;
    discountLabel: string;
  }>;
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
  originalCharge,
  discountBadge,
  packageDiscounts,
  user_background_img,
  user_profile_img,
  category,
}: UserCardProps) {
  const { t } = useLanguage();

  return (
    <div
      className="
        group flex h-full flex-col
        w-full min-w-0
        font-inter text-base leading-6 text-left
        text-(--color-text)
        bg-(--color-card) border border-(--color-border)
        rounded-xl shadow-md overflow-hidden
        transition-all duration-300 cursor-pointer
        hover:bg-(--color-card-hover) hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Gig Image */}
      <div className="relative">
        {user_background_img ? (
          <img
            src={user_background_img}
            className="w-full h-44 object-cover"
            alt={description}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-44 flex justify-center items-center bg-(image:--gradient-secondary) text-3xl">
            <FontAwesomeIcon icon={faCode} />
          </div>
        )}

        {discountBadge && (
          <span className="absolute top-3 left-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            {discountBadge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Seller Info */}
        <div className="flex items-center gap-2.5">
          {user_profile_img ? (
            <img
              src={user_profile_img}
              alt={username}
              className="w-9 h-9 shrink-0 rounded-full object-cover object-center border-2 border-(--color-border)"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span
              className="
                flex items-center justify-center
                w-9 h-9 shrink-0
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
        <p className="text-sm text-(--color-text) line-clamp-2 min-h-10 transition-colors duration-300 group-hover:text-(--color-primary)">
          {description}
        </p>

        {/* Category Badge */}
        {category && (
          <span className="self-start text-xs px-2 py-0.5 rounded-full bg-(--color-primary)/10 text-(--color-primary) font-medium">
            {category}
          </span>
        )}

        {packageDiscounts && packageDiscounts.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {packageDiscounts.map((pkgDiscount, index) => (
              <span
                key={`${pkgDiscount.packageLabel}-${index}`}
                className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-600"
              >
                {pkgDiscount.packageLabel}: {pkgDiscount.discountLabel}
              </span>
            ))}
          </div>
        )}

        {/* Rating & Price */}
        <div className="mt-auto flex justify-between items-center pt-2 border-t border-(--color-border)">
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
          <div className="text-right">
            {originalCharge && (
              <p className="text-xs text-(--color-text-muted) line-through">
                {originalCharge}
              </p>
            )}
            <p className="text-sm font-bold text-(--color-text)">
              {t("gigCard.startingAt")}{" "}
              <span className="text-(--color-primary)">{charge}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersCard;
