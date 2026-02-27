import { NavLink, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.tsx";
import Button from "../btns/Button.tsx";
import SearchBar from "./SearchBar.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import NavLinks from "../../utils/NavLinks.tsx";
import { useCollapse } from "../../context/SideBarContextCollapse.tsx";
import { useEffect, useState } from "react";
import ProfileDropdown from "./profileIcon.tsx";
import moon from "../../assets/moon.png";
import theme from "../../assets/theme.png";
import me, { type AuthResponse } from "../../API/me.tsx";
import { getUnreadCount } from "../../API/NotificationsAPI.ts";
import { isAuthenticated } from "../../API/apiClient.ts";

const getUser = async () => {
  const user = await me();

  if (user) {
    return user;
  } else {
    return null;
  }
};

function Navbar() {
  const { toggleTheme, isBgLight } = useTheme();
  const { toggleCollapse } = useCollapse();
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated()) {
        setUser(null);
        return;
      }

      const user = await getUser();
      setUser(user);

      if (user) {
        try {
          const count = await getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error("Failed to get unread count:", error);
        }
      }
    };

    fetchUser();

    // Poll for notifications every 30 seconds if logged in
    const interval = setInterval(() => {
      if (isAuthenticated()) {
        getUnreadCount().then(setUnreadCount).catch(console.error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const isFreelancer =
    user?.data?.role === "freelancer" ||
    user?.data?.role === "business" ||
    user?.data?.role === "admin";

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
              className="text-2xl cursor-pointer mr-2"
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
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* CENTER - SEARCH BAR */}
        <div className="hidden lg:flex flex-1  justify-center ">
          <SearchBar />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1.5 shrink-0 p-2 rounded-3xl animated shadow-(--color-shadow) shadow-md">
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

          {!isAuthenticated() ? (
            <>
              <Link to="/sign-in">
                <Button
                  text="Sign In"
                  bgColor="bg-[var(--color-bg-inverse)]"
                  textColor="text-[var(--color-text-inverse)]"
                />
              </Link>

              <Link to="/sign-up">
                <Button
                  text="Sign Up"
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
                title="Messages"
              >
                <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
              </Link>

              {/* Notifications */}
              <Link
                to="/notifications"
                className="relative p-2 hover:bg-(--color-surface) rounded-full transition-all text-(--color-text-muted) hover:text-(--color-primary)"
                title="Notifications"
              >
                <FontAwesomeIcon icon={faBell} className="text-lg" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile dropdown with all other actions */}
              <ProfileDropdown user={user} isFreelancer={isFreelancer} />
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
