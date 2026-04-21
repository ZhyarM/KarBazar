import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar_components/Navbar.tsx";
import Sidebar from "../components/navbar_components/Sidebar.tsx";
import Footer from "../components/Footer.tsx";

export default function Root() {
  const { pathname } = useLocation();

  const hideFooter =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/order/") ||
    pathname === "/notifications" ||
    pathname === "/favorites" ||
    pathname === "/my-gigs" ||
    pathname === "/create-gig" ||
    pathname.startsWith("/edit-gig/") ||
    pathname === "/create-post" ||
    pathname.startsWith("/edit-post/") ||
    pathname.startsWith("/admin");

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
