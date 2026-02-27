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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import me from "../../API/me.tsx";

function isLogedIn() {
  return document.cookie
    .split(";")
    .some((row) => row.trim().startsWith("Authorization="));
}

export default function Sidebar(): JSX.Element {
  const { isCollapse, toggleCollapse } = useCollapse();
  const { isBgLight } = useTheme();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLogedIn()) {
        const user = await me();
        setUserRole(user?.data?.role || null);
      }
    };
    fetchUser();
  }, []);

  const authenticatedLinks = [
    { to: "/dashboard", label: "Dashboard", icon: faTachometerAlt },
    { to: "/orders", label: "Orders", icon: faShoppingCart },
    { to: "/messages", label: "Messages", icon: faEnvelope },
    { to: "/notifications", label: "Notifications", icon: faBell },
    { to: "/favorites", label: "Favorites", icon: faHeart },
  ];

  const freelancerLinks = [
    { to: "/my-gigs", label: "My Gigs", icon: faBriefcase },
    { to: "/create-gig", label: "Create Gig", icon: faPlus },
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 h-screen w-[250px] m-0 z-999 backdrop-blur-md
        shadow-xl flex flex-col items-start justify-start
        transform transition-transform duration-500 ease-in-out
        ${
          isBgLight
            ? "bg-[oklch(0.96_0.025_264)] text-[oklch(0.15_0.05_264)]"
            : "bg-[oklch(0.15_0.025_246)] text-[oklch(0.92_0.025_264)]"
        }
        ${isCollapse ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <button
        onClick={toggleCollapse}
        className="p-2 hover:opacity-80 transition-opacity flex justify-end w-full text-2xl cursor-pointer"
        aria-label="Close sidebar"
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
              {link.label}
            </NavLink>
          </li>
        ))}

        {/* Authenticated User Links */}
        {isLogedIn() && (
          <>
            <li className="mt-4 px-3 py-2 text-xs font-semibold text-(--color-text-muted) uppercase">
              Your Account
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
            {(userRole === "freelancer" ||
              userRole === "business" ||
              userRole === "admin") && (
              <>
                <li className="mt-4 px-3 py-2 text-xs font-semibold text-(--color-text-muted) uppercase">
                  Seller
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
          </>
        )}
      </ul>
    </nav>
  );
}
