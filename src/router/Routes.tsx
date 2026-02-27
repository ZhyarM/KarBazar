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
import UserProfile from "../page_components/user/userProfile.tsx";
import FreelancerProfile from "../page_components/user/sample.tsx";

// New Pages
import Dashboard from "../pages/Dashboard.tsx";
import Messages from "../pages/Messages.tsx";
import Orders from "../pages/Orders.tsx";
import OrderDetails from "../pages/OrderDetails.tsx";
import CreateGig from "../pages/CreateGig.tsx";
import MyGigs from "../pages/MyGigs.tsx";
import Notifications from "../pages/Notifications.tsx";
import Favorites from "../pages/Favorites.tsx";
import Checkout from "../pages/Checkout.tsx";

// Post Pages
import CreatePost from "../pages/CreatePost.tsx";
import PostDetail from "../pages/PostDetail.tsx";

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "browseGigs", element: <BrowseGigs /> },
      { path: "browse-gigs", element: <BrowseGigs /> },
      { path: "/user/:userId", element: <UserDetails /> },
      { path: "/gig/:id", element: <UserDetails /> },
      { path: "/gigs/:id", element: <UserDetails /> },
      { path: "categories", element: <Categories /> },
      { path: "about", element: <About /> },
      { path: "sign-in", element: <SignIn /> },
      { path: "auth/signin", element: <SignIn /> },
      { path: "auth/login", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "auth/register", element: <SignUp /> },
      { path: "sampleProfile", element: <FreelancerProfile /> },
      { path: "profile", element: <UserProfile /> },
      { path: "my-profile", element: <UserProfile /> },
      { path: "profile/:username", element: <UserProfile /> },

      // Dashboard and User Pages
      { path: "dashboard", element: <Dashboard /> },
      { path: "messages", element: <Messages /> },
      { path: "messages/:userId", element: <Messages /> },
      { path: "orders", element: <Orders /> },
      { path: "order/:id", element: <OrderDetails /> },
      { path: "notifications", element: <Notifications /> },
      { path: "favorites", element: <Favorites /> },

      // Gig Management (Freelancers)
      { path: "create-gig", element: <CreateGig /> },
      { path: "my-gigs", element: <MyGigs /> },
      { path: "edit-gig/:id", element: <CreateGig /> },
      { path: "checkout/:gigId", element: <Checkout /> },

      // Post Management
      { path: "create-post", element: <CreatePost /> },
      { path: "edit-post/:id", element: <CreatePost /> },
      { path: "posts/:id", element: <PostDetail /> },
    ],
  },
]);

export default router;
