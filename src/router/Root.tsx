import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar_components/Navbar.tsx";
import Sidebar from "../components/navbar_components/Sidebar.tsx";
import Footer from "../components/Footer.tsx";
import Snowfall from "react-snowfall";

export default function Root() {
  const { pathname } = useLocation();

  const hideFooter = pathname === "/sign-in" || pathname === "/sign-up";
  const hideNavBar = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <>
      {!hideNavBar && <Navbar />}
      <Sidebar />
     
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
}
