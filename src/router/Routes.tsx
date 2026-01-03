import { createBrowserRouter } from "react-router-dom";
import Home from "./../pages/Home.tsx";
import Categories from "./../pages/Categories.tsx";
import BrowseGigs from "../pages/BrowseGigs.tsx";
import About from "./../pages/About.tsx";
import SignIn from "./../pages/auth/SignIn.tsx";
import SignUp from "./../pages/auth/SignUp.tsx";
import ErrorPage from "./../pages/ErrorPages/ErrorPage.tsx";
import Root from "./Root.tsx";
import UserDetails from "./../page_components/user_profile/UserDetails";

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "browseGigs", element: <BrowseGigs /> },
      { path: "/user/:userId", element: <UserDetails /> },
      { path: "categories", element: <Categories /> },
      { path: "about", element: <About /> },
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
    ],
  },
]);

export default router;
