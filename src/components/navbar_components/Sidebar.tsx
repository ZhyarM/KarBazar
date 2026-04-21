import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.tsx";
import { useCollapse } from "../../context/SideBarContextCollapse.tsx";
import type { JSX } from "react";
import NavLinks from "../../utils/NavLinks.tsx";
import {
  faSquareXmark,
  faTachometerAlt,
  faShoppingCart,
  faEnvelope,
  faBell,
  faHeart,
  faBriefcase,
  faPlus,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isSellerRole } from "../../utils/roles";
import { useLanguage } from "../../context/LanguageContext.tsx";
import { useUserData } from "../../context/UserDataContext.tsx";

export default function Sidebar(): JSX.Element {
  const { isCollapse, toggleCollapse } = useCollapse();
  const { isBgLight } = useTheme();
  const { t, direction } = useLanguage();
  const { user } = useUserData();
  const userRole = user?.data?.role ?? null;
  const isLoggedIn = Boolean(user?.data);
  const isRTL = direction === "rtl";

  const authenticatedLinks = [
    { to: "/dashboard", label: t("sidebar.dashboard"), icon: faTachometerAlt },
    { to: "/orders", label: t("sidebar.orders"), icon: faShoppingCart },
    { to: "/messages", label: t("nav.messages"), icon: faEnvelope },
    { to: "/notifications", label: t("nav.notifications"), icon: faBell },
    { to: "/favorites", label: t("sidebar.favorites"), icon: faHeart },
  ];

  const freelancerLinks = [
    { to: "/my-gigs", label: t("sidebar.myGigs"), icon: faBriefcase },
    { to: "/create-gig", label: t("sidebar.createGig"), icon: faPlus },
  ];

  return (
    <nav
      className={`
        fixed top-0 ${isRTL ? "right-0" : "left-0"} h-screen w-[250px] m-0 z-999 backdrop-blur-md
        shadow-xl flex flex-col items-start justify-start
        transform transition-transform duration-500 ease-in-out
        ${
          isBgLight
            ? "bg-[oklch(0.96_0.025_264)] text-[oklch(0.15_0.05_264)]"
            : "bg-[oklch(0.15_0.025_246)] text-[oklch(0.92_0.025_264)]"
        }
        ${isCollapse ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"}
      `}
    >
      <button
        onClick={toggleCollapse}
        className="p-2 hover:opacity-80 transition-opacity flex justify-end w-full text-2xl cursor-pointer"
        aria-label={t("sidebar.close")}
      >
        <FontAwesomeIcon icon={faSquareXmark} />
      </button>

      <ul className="flex flex-col gap-2.5 m-2.5 text-sm w-full px-2">
        {/* Public Links */}
        {NavLinks.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `
                block px-3 py-2 rounded-md transition-all duration-200
                ${isBgLight ? "hover:bg-black/5" : "hover:bg-white/10"}
                ${
                  isActive
                    ? "text-(--color-primary-active)"
                    : "text-(--color-text) hover:text-(--color-primary-hover)"
                }
              `
              }
              onClick={toggleCollapse}
            >
              {t(link.labelKey)}
            </NavLink>
          </li>
        ))}

        {/* Authenticated User Links */}
        {isLoggedIn && (
          <>
            <li className="mt-4 px-3 py-2 text-xs font-semibold text-(--color-text-muted) uppercase">
              {t("sidebar.yourAccount")}
            </li>
            {authenticatedLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
                    ${isBgLight ? "hover:bg-black/5" : "hover:bg-white/10"}
                    ${
                      isActive
                        ? "text-(--color-primary-active) bg-opacity-10"
                        : "text-(--color-text) hover:text-(--color-primary-hover)"
                    }
                  `
                  }
                  onClick={toggleCollapse}
                >
                  <FontAwesomeIcon icon={link.icon} />
                  {link.label}
                </NavLink>
              </li>
            ))}

            {/* Freelancer-only Links */}
            {isSellerRole(userRole) && (
              <>
                <li className="mt-4 px-3 py-2 text-xs font-semibold text-(--color-text-muted) uppercase">
                  {t("sidebar.seller")}
                </li>
                {freelancerLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `
                        flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
                        ${isBgLight ? "hover:bg-black/5" : "hover:bg-white/10"}
                        ${
                          isActive
                            ? "text-(--color-primary-active) bg-opacity-10"
                            : "text-(--color-text) hover:text-(--color-primary-hover)"
                        }
                      `
                      }
                      onClick={toggleCollapse}
                    >
                      <FontAwesomeIcon icon={link.icon} />
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </>
            )}

            {userRole === "admin" && (
              <>
                <li className="mt-4 px-3 py-2 text-xs font-semibold text-(--color-text-muted) uppercase">
                  {t("sidebar.admin")}
                </li>
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `
                        flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
                        ${isBgLight ? "hover:bg-black/5" : "hover:bg-white/10"}
                        ${
                          isActive
                            ? "text-(--color-primary-active) bg-opacity-10"
                            : "text-(--color-text) hover:text-(--color-primary-hover)"
                        }
                      `
                    }
                    onClick={toggleCollapse}
                  >
                    <FontAwesomeIcon icon={faShieldAlt} />
                    {t("sidebar.adminPanel")}
                  </NavLink>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}
