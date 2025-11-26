import { NavLink, Link, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.tsx";
import Button from "./Button.tsx";
import SearchBar from "./SearchBar.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import NavLinks from "../utils/NavLinks.tsx";
import { useCollapse } from "../context/SideBarContextCollapse.tsx";
import { useEffect, useState } from "react";

function Navbar() {
  const { toggleTheme, isBgLight } = useTheme();
  const { toggleCollapse } = useCollapse();
  const [isTop, setIsTop] = useState(true);


  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0)
      
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  },[])

  return (
    <>
      <nav
        className={`w-full fixed z-50 flex justify-between items-center gap-1 py-2.5 px-4 text-sm transition-all duration-300 ${
          isTop ? "bg-transparent":"bg-(--color-background)" 
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
            <p className="flex justify-center items-center h-[30px] w-[30px] bg-(--color-primary) text-amber-50 rounded-lg font-bold hover:scale-110 transition-transform duration-300 h-8">
              K
            </p>
          </Link>
          {
            <ul className="hidden lg:flex items-center gap-2">
              {NavLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `font-bold text-sm p-1 transition-all duration-300 nav h-8 ${
                        isActive
                          ? "text-(--color-primary-active)"
                          : "text-(--color-text-muted) hover:text-(--color-primary-hover) hover:scale-110"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          }
        </div>

        <div className="hidden lg:-translate-x-14 md:block md:translate-x-14 min-w-0">
          <SearchBar />
        </div>

        <div className="flex justify-center items-center gap-2 flex-nowrap mx-2">
          <button onClick={toggleTheme} className="cursor-pointer nav p-1">
            {isBgLight ? (
              <FontAwesomeIcon icon={faSun} />
            ) : (
              <FontAwesomeIcon icon={faMoon} />
            )}
          </button>
          <Link to="/sign-in">
            <Button
              text={"Sign In"}
              bgColor=" nav"
              textColor="var(--btn-primary-inverse)"
              backdropColor=""
            />
          </Link>
          <Link to="/sign-up">
            <Button
              text={"Sign Up"}
              bgColor="bg-[var(--btn-primary)]"
              textColor="var(--btn-primary-text)"
              backdropColor=""
            />
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
