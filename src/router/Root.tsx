import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar_components/Navbar.tsx";
import Sidebar from "../components/navbar_components/Sidebar.tsx";
import Footer from "./../page_components/Footer.tsx";
import Snowfall from "react-snowfall";

export default function Root() {
  const { pathname } = useLocation();

  const hideFooter = pathname === "/sign-in" || pathname === "/sign-up";
  const hideNavBar = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <>
      {!hideNavBar && <Navbar />}
      <Sidebar />
      <Snowfall
        color="#82c3d9"
        snowflakeCount={150}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: "1000",
          pointerEvents: "none",
        }}
      />
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
}
