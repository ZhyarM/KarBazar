import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.tsx";
import Button from "../btns/Button.tsx";
import SearchBar from "./SearchBar.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faEnvelope,
  faToggleOff,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import NavLinks from "../../utils/NavLinks.tsx";
import { useCollapse } from "../../context/SideBarContextCollapse.tsx";
import ProfileDropdown from "./profileIcon.tsx";
import moon from "../../assets/moon.png";
import theme from "../../assets/theme.png";
import { isSellerRole } from "../../utils/roles";
import { useLanguage } from "../../context/LanguageContext.tsx";
import { useUserData } from "../../context/UserDataContext.tsx";
import { useSearch } from "../../context/SearchContext.tsx";
import { useEffect, useRef } from "react";

function Navbar() {
  const { toggleTheme, isBgLight } = useTheme();
  const { toggleCollapse } = useCollapse();
  const { language, toggleLanguage, direction, t } = useLanguage();
  const { user, unreadCount } = useUserData();
  const { clearSearch } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const isRTL = direction === "rtl";
  const isLoggedIn = Boolean(user?.data);

  const isSeller = isSellerRole(user?.data?.role);

  // Clear search only when leaving /search to another page
  useEffect(() => {
    const previousPath = previousPathRef.current;
    const currentPath = location.pathname;

    if (previousPath === "/search" && currentPath !== "/search") {
      clearSearch();
    }

    previousPathRef.current = currentPath;
  }, [location.pathname, clearSearch]);

  return (
    <>
      <nav
        className="  w-full sticky top-0 z-50
     py-2.5 px-4 text-sm
     bg-(--color-bg)
    flex items-center justify-between gap-3 "
      >
        {/* LEFT */}
        <div className="flex items-center gap-2 shrink-0 shadow-md shadow-(--color-shadow) rounded-2xl p-2">
          <span className="lg:hidden md:block" onClick={toggleCollapse}>
            <FontAwesomeIcon
              icon={faBars}
              className={`text-2xl cursor-pointer ${isRTL ? "ml-2" : "mr-2"}`}
            />
          </span>

          <Link to="/">
            <p className="flex justify-center items-center w-8 h-8 bg-(--color-primary) text-amber-50 rounded-lg font-bold hover:scale-110 hover:text-xl transition-all duration-300">
              K
            </p>
          </Link>

          <ul className="hidden lg:flex justify-center items-center gap-2">
            {NavLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `font-bold text-lg p-1 transition-all duration-300 title ${
                      isActive
                        ? "text-(--color-accent)"
                        : "text-(--color-text-muted) hover:text-(--color-primary) hover:scale-110"
                    }`
                  }
                >
                  {t(link.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* CENTER - SEARCH BAR */}
        <div className="hidden lg:flex flex-1  justify-center ">
          <SearchBar
            onSearch={(query) => {
              const q = query.trim();
              if (!q) {
                return;
              }
              navigate(`/search?q=${encodeURIComponent(q)}`);
            }}
            onInputChange={(query) => {
              const q = query.trim();
              if (!q) {
                return;
              }
              navigate(`/search?q=${encodeURIComponent(q)}`, {
                replace: true,
              });
            }}
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1.5 shrink-0 p-2 rounded-3xl animated shadow-(--color-shadow) shadow-md">
          <button
            onClick={toggleLanguage}
            className="cursor-pointer nav p-1.5 text-(--color-text) rounded-full hover:bg-(--color-surface) transition-colors"
            aria-label={t("navbar.toggleLanguage")}
            title={
              language === "en" ? t("language.kurdish") : t("language.english")
            }
          >
            <FontAwesomeIcon
              icon={language === "ku" ? faToggleOn : faToggleOff}
              className={`text-lg ${language === "ku" ? "text-(--color-primary)" : "text-(--color-text-muted)"}`}
            />
          </button>

          <button
            onClick={toggleTheme}
            className="cursor-pointer nav p-1.5 text-(--color-text) rounded-full hover:bg-(--color-surface) transition-colors"
          >
            {isBgLight ? (
              <img src={theme} className="w-5 h-5" alt="" />
            ) : (
              <img src={moon} className="w-5 h-5" alt="" />
            )}
          </button>

          {!isLoggedIn ? (
            <>
              <Link to="/sign-in">
                <Button
                  text={t("auth.signIn")}
                  bgColor="bg-[var(--color-bg-inverse)]"
                  textColor="text-[var(--color-text-inverse)]"
                />
              </Link>

              <Link to="/sign-up">
                <Button
                  text={t("auth.signUp")}
                  bgColor="bg-(--color-primary)"
                  textColor="text-[var(--color-text)]"
                />
              </Link>
            </>
          ) : (
            <>
              {/* Messages */}
              <Link
                to="/messages"
                className="relative p-2 hover:bg-(--color-surface) rounded-full transition-all text-(--color-text-muted) hover:text-(--color-primary)"
                title={t("nav.messages")}
              >
                <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
              </Link>

              {/* Notifications */}
              <Link
                to="/notifications"
                className="relative p-2 hover:bg-(--color-surface) rounded-full transition-all text-(--color-text-muted) hover:text-(--color-primary)"
                title={t("nav.notifications")}
              >
                <FontAwesomeIcon icon={faBell} className="text-lg" />
                {unreadCount > 0 && (
                  <span
                    className={`absolute top-0.5 ${isRTL ? "left-0.5" : "right-0.5"} bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none`}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile dropdown with all other actions */}
              <ProfileDropdown user={user} isFreelancer={isSeller} />
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
