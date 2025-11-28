import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Sidebar from "../components/Sidebar.tsx";
import Footer from './../page_components/Footer.tsx';

export default function Root() {
  const { pathname } = useLocation();

  const hideFooter = pathname === "/sign-in" || pathname === "/sign-up";
  
  return (
    <>
      <Navbar />
      <Sidebar />
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
}
