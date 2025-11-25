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
        className={`w-full flex justify-between items-center gap-1 py-2.5 px-4 rounded-b-md text-sm transition-all duration-300 ${
          isBgLight
            ? "bg-[oklch(0.96_0.025_264)]"
            : "bg-[oklch(0.15_0.025_246)] text-[oklch(0.76_0.02_264)]"
        }`}
      >
        <div className="flex justify-center items-center flex-row gap-1">
          <span className="lg:hidden md:block" onClick={toggleCollapse}>
            <FontAwesomeIcon
              icon={faBars}
              className="text-2xl cursor-pointer mr-2"
            />
          </span>

          <Link to="/">
            <p className="flex justify-center items-center h-[30px] w-[30px] bg-blue-700 text-amber-50 rounded-lg font-bold hover:scale-110 transition-transform duration-300">
              K
            </p>
          </Link>
          <Link
            to="/"
            className="text-lg font-bold text-blue-700 whitespace-nowrap"
          >
            KarBazar
          </Link>
        </div>

        {
          <ul className="hidden lg:flex items-center gap-1">
            {NavLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `font-medium text-sm p-1.5 transition-all duration-300 transform ${
                      isActive
                        ? "text-blue-700"
                        : "text-[oklch(0.76_0.02_264)] hover:text-blue-700 hover:scale-110"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        }
        <div className="hidden md:block min-w-0">
          <SearchBar />
        </div>
        <div className="flex justify-center items-center gap-2 flex-nowrap mx-2">
          <button onClick={toggleTheme} className="cursor-pointer">
            {isBgLight ? (
              <FontAwesomeIcon icon={faSun} />
            ) : (
              <FontAwesomeIcon icon={faMoon} />
            )}
          </button>
          <Link to="/sign-in">
            <Button
              text={"Sign In"}
              bgColor={"btn"}
              backdropColor=""
              textColor={
                isBgLight
                  ? "oklch(0.15 0.05 264)"
                  : "oklch(95.968% 0.01912 263.062)"
              }
            />
          </Link>
          <Link to="/sign-up">
            <Button
              text={"Sign Up"}
              bgColor={"btn-primary"}
              textColor="oklch(0.92 0.025 264)"
              backdropColor=""
            />
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
