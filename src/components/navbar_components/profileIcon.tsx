import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faTachometerAlt,
  faShoppingCart,
  faHeart,
  faPlus,
  faPenNib,
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "../../API/LogoutAPI";
import { getAvatarUrl } from "../../utils/imageUrl";
import type { AuthResponse } from "../../API/me.tsx";

interface ProfileDropdownProps {
  user: AuthResponse | null;
  isFreelancer: boolean;
}

const ProfileDropdown = ({ user, isFreelancer }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarUrl = getAvatarUrl(user?.data?.profile?.avatar_url);
  const name = user?.data?.name || "User";
  const role = user?.data?.role || "client";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-(--color-primary)/40 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#315bb5] to-[#6D28D9] flex items-center justify-center text-white font-bold text-sm">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-56 bg-(--color-surface) rounded-2xl shadow-xl border border-(--color-border) z-50 overflow-hidden">
            {/* User info header */}
            <div className="px-4 py-3 border-b border-(--color-border)">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-[#315bb5] to-[#6D28D9] flex items-center justify-center text-white font-bold text-sm">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-(--color-text) text-sm truncate">
                    {name}
                  </p>
                  <p className="text-xs text-(--color-text-muted) capitalize">
                    {role}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <div className="py-1.5">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) hover:bg-(--color-bg) transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-4 text-(--color-text-muted)"
                />
                My Profile
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) hover:bg-(--color-bg) transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faTachometerAlt}
                  className="w-4 text-(--color-text-muted)"
                />
                Dashboard
              </Link>

              <Link
                to="/orders"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) hover:bg-(--color-bg) transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="w-4 text-(--color-text-muted)"
                />
                Orders
              </Link>

              <Link
                to="/favorites"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) hover:bg-(--color-bg) transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className="w-4 text-(--color-text-muted)"
                />
                Favorites
              </Link>
            </div>

            {/* Freelancer actions */}
            {isFreelancer && (
              <div className="border-t border-(--color-border) py-1.5">
                <p className="px-4 pt-1 pb-1 text-[10px] font-semibold text-(--color-text-muted) uppercase tracking-wider">
                  Create
                </p>
                <Link
                  to="/create-gig"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) hover:bg-(--color-bg) transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="w-4 text-(--color-primary)"
                  />
                  New Gig
                </Link>
                <Link
                  to="/create-post"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) hover:bg-(--color-bg) transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <FontAwesomeIcon
                    icon={faPenNib}
                    className="w-4 text-(--color-primary)"
                  />
                  New Post
                </Link>
              </div>
            )}

            {/* Logout */}
            <div className="border-t border-(--color-border) py-1.5">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 w-full transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
