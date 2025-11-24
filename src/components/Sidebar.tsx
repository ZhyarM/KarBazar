import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.tsx";
import { useCollapse } from "../context/SideBarContextCollapse.tsx";
import type { JSX } from "react";
import NavLinks from "../utils/NavLinks.tsx";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Sidebar(): JSX.Element {
  const { isCollapse, toggleCollapse } = useCollapse();
  const { isBgLight } = useTheme();

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
      aria-hidden={!isCollapse}
    >
      <button
        onClick={toggleCollapse}
        className="p-2 hover:opacity-80 transition-opacity flex justify-end w-full text-2xl"
        aria-label="Close sidebar"
      >
        <FontAwesomeIcon icon={faSquareXmark} />
      </button>

      <ul className="flex flex-col gap-2.5 m-2.5 text-sm">
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
                    ? "text-blue-600"
                    : "text-[oklch(0.76_0.02_264)] hover:text-blue-500"
                }
              `
              }
              onClick={toggleCollapse}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
