import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar_components/Navbar.tsx";
import Sidebar from "../components/navbar_components/Sidebar.tsx";
import Footer from "../components/Footer.tsx";
import { useUserData } from "../context/UserDataContext.tsx";

export default function Root() {
  const { pathname } = useLocation();
  const { authLoading } = useUserData();

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

  if (authLoading && !hideNavBar) {
    return (
      <div className="min-h-screen bg-(--color-bg) flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-(--color-text-muted)">
          <div className="h-10 w-10 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
          <p className="text-sm font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!hideNavBar && <Navbar />}
      <Sidebar />
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
}
