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
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "../../API/LogoutAPI";
import { getImageUrlCandidates } from "../../utils/imageUrl";
import type { AuthResponse } from "../../API/me.tsx";
import { isAdminRole, roleLabel } from "../../utils/roles";
import { useLanguage } from "../../context/LanguageContext.tsx";

interface ProfileDropdownProps {
  user: AuthResponse | null;
  isFreelancer: boolean;
}

const ProfileDropdown = ({ user, isFreelancer }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t, direction } = useLanguage();
  const isRTL = direction === "rtl";

  const avatarCandidates = getImageUrlCandidates(user?.data?.profile?.avatar_url);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const avatarUrl = avatarCandidates[avatarIndex] || "";
  const name = user?.data?.name || t("profile.user");
  const role = roleLabel(user?.data?.role);

  useEffect(() => {
    setAvatarIndex(0);
  }, [user?.data?.profile?.avatar_url]);

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
        className={`${isRTL ? "mr-1" : "ml-1"} w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-(--color-primary)/40 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => {
              if (avatarIndex < avatarCandidates.length - 1) {
                setAvatarIndex((prev) => prev + 1);
                return;
              }

              setAvatarIndex(avatarCandidates.length);
            }}
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
          <div
            className={`absolute ${isRTL ? "left-0" : "right-0"} mt-3 w-56 bg-(--color-surface) rounded-2xl shadow-xl border border-(--color-border) z-50 overflow-hidden`}
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-(--color-border)">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={() => {
                        if (avatarIndex < avatarCandidates.length - 1) {
                          setAvatarIndex((prev) => prev + 1);
                          return;
                        }

                        setAvatarIndex(avatarCandidates.length);
                      }}
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
                {t("profile.myProfile")}
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
                {t("profile.dashboard")}
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
                {t("profile.orders")}
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
                {t("profile.favorites")}
              </Link>
            </div>

            {/* Freelancer actions */}
            {isFreelancer && (
              <div className="border-t border-(--color-border) py-1.5">
                <p className="px-4 pt-1 pb-1 text-[10px] font-semibold text-(--color-text-muted) uppercase tracking-wider">
                  {t("profile.create")}
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
                  {t("profile.newGig")}
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
                  {t("profile.newPost")}
                </Link>
              </div>
            )}

            {isAdminRole(user?.data?.role) && (
              <div className="border-t border-(--color-border) py-1.5">
                <p className="px-4 pt-1 pb-1 text-[10px] font-semibold text-(--color-text-muted) uppercase tracking-wider">
                  {t("profile.admin")}
                </p>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) hover:bg-(--color-bg) transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <FontAwesomeIcon
                    icon={faShieldAlt}
                    className="w-4 text-(--color-primary)"
                  />
                  {t("profile.adminPanel")}
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
                {t("profile.signOut")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
