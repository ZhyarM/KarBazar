import { NavLink, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.tsx";
import Button from "./Button.tsx";
import SearchBar from "./SearchBar.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import NavLinks from "../utils/NavLinks.tsx";
import { useCollapse } from "../context/SideBarContextCollapse.tsx";

function Navbar() {
  const { toggleTheme, isBgLight } = useTheme();
  const { toggleCollapse } = useCollapse();

  return (
    <>
      <nav
        className=" w-full fixed z-50 
  grid grid-cols-[auto_1fr_auto] 
  items-center 
  border py-2.5 px-4 text-sm 
  bg-(--color-bg)"
      >
        {/* LEFT */}
        <div className="flex items-center gap-1">
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

          <ul className="hidden lg:flex items-center gap-2">
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
        <div className="hidden md:flex justify-center lg:justify-around">
          <SearchBar />
        </div>

        {/* RIGHT */}
        <div className="flex justify-end items-center gap-2">
          <button
            onClick={toggleTheme}
            className="cursor-pointer nav p-1 text-(--color-text)"
          >
            {isBgLight ? (
              <FontAwesomeIcon icon={faSun} />
            ) : (
              <FontAwesomeIcon icon={faMoon} />
            )}
          </button>

          <Link to="/sign-in">
            <Button
              text="Sign In"
              bgColor="bg-gray-200"
              backdropColor=""
              textColor="black"
            />
          </Link>

          <Link to="/sign-up">
            <Button
              text="Sign Up"
              backdropColor=""
              bgColor="bg-(--color-primary)"
              textColor="white"
            />
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
