import { NavLink, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.tsx";
import Button from "../btns/Button.tsx";
import SearchBar from "./SearchBar.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavLinks from "../../utils/NavLinks.tsx";
import { useCollapse } from "../../context/SideBarContextCollapse.tsx";
import { useEffect, useState } from "react";
import Profile from "./profileIcon.tsx";
import moon from "../../assets/moon.png";
import theme from "../../assets/theme.png";
import me, {type AuthResponse} from "../../API/me.tsx";


function isLogedIn() {
  return document.cookie
    .split(";")
    .some((row) => row.trim().startsWith("Authorization="));
}

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

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };

    fetchUser()
  },[]);

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
        <div className="flex items-center gap-2 shrink-0 p-2  rounded-3xl animated shadow-(--color-shadow) shadow-md">
          <button
            onClick={toggleTheme}
            className="cursor-pointer nav p-1 text-(--color-text)"
          >
            {isBgLight ? (
              <img src={theme} className="w-6 h-6" alt="" />
            ) : (
              <img src={moon} className="w-6 h-6" alt="" />
            )}
          </button>

          {!isLogedIn() ? (
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
            
              <Profile  username={user?.data?.name  || "Error"} />
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
