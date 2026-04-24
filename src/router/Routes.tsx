import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./Root.tsx";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute.tsx";
import AdminLayout from "../pages/admin/AdminLayout.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";

// Lazy-loaded page components
const Home = lazy(() => import("./../pages/Home.tsx"));
const Categories = lazy(() => import("./../pages/Categories.tsx"));
const BrowseGigs = lazy(() => import("../pages/BrowseGigs.tsx"));
const Deals = lazy(() => import("../pages/Deals.tsx"));
const About = lazy(() => import("./../pages/About.tsx"));
const SignIn = lazy(() => import("./../pages/auth/SignIn.tsx"));
const SignUp = lazy(() => import("./../pages/auth/SignUp.tsx"));
const ErrorPage = lazy(() => import("./../pages/ErrorPages/ErrorPage.tsx"));
const UserDetails = lazy(
  () => import("./../page_components/user_profile/UserDetails"),
);
const UserProfile = lazy(
  () => import("../page_components/user/userProfile.tsx"),
);
const FreelancerProfile = lazy(
  () => import("../page_components/user/sample.tsx"),
);
const Dashboard = lazy(() => import("../pages/Dashboard.tsx"));
const Messages = lazy(() => import("../pages/Messages.tsx"));
const Orders = lazy(() => import("../pages/Orders.tsx"));
const OrderDetails = lazy(() => import("../pages/OrderDetails.tsx"));
const CreateGig = lazy(() => import("../pages/CreateGig.tsx"));
const MyGigs = lazy(() => import("../pages/MyGigs.tsx"));
const Notifications = lazy(() => import("../pages/Notifications.tsx"));
const Favorites = lazy(() => import("../pages/Favorites.tsx"));
const Checkout = lazy(() => import("../pages/Checkout.tsx"));
const SearchResults = lazy(() => import("../pages/SearchResults.tsx"));
const AdminOverviewPage = lazy(
  () => import("../pages/admin/AdminOverview.tsx"),
);
const AdminUsersPage = lazy(() => import("../pages/admin/AdminUsers.tsx"));
const AdminControlPage = lazy(() => import("../pages/admin/AdminControl.tsx"));
const AdminListingsPage = lazy(
  () => import("../pages/admin/AdminListings.tsx"),
);
const AdminCategoriesPage = lazy(
  () => import("../pages/admin/AdminCategories.tsx"),
);
const AdminOrdersPage = lazy(() => import("../pages/admin/AdminOrders.tsx"));
const AdminReviewsPage = lazy(() => import("../pages/admin/AdminReviews.tsx"));
const AdminNewsPage = lazy(() => import("../pages/admin/AdminNews.tsx"));
const AdminSettingsPage = lazy(
  () => import("../pages/admin/AdminSettings.tsx"),
);
const CreatePost = lazy(() => import("../pages/CreatePost.tsx"));
const PostDetail = lazy(() => import("../pages/PostDetail.tsx"));

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    element: <Root />,
    errorElement: (
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "browseGigs",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <BrowseGigs />
          </Suspense>
        ),
      },
      {
        path: "browse-gigs",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <BrowseGigs />
          </Suspense>
        ),
      },
      {
        path: "deals",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Deals />
          </Suspense>
        ),
      },
      {
        path: "search",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <SearchResults />
          </Suspense>
        ),
      },
      {
        path: "/user/:userId",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <UserDetails />
          </Suspense>
        ),
      },
      {
        path: "/gig/:id",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <UserDetails />
          </Suspense>
        ),
      },
      {
        path: "/gigs/:id",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <UserDetails />
          </Suspense>
        ),
      },
      {
        path: "categories",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Categories />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "sign-in",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: "auth/signin",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: "auth/login",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: "sign-up",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <SignUp />
          </Suspense>
        ),
      },
      {
        path: "auth/register",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <SignUp />
          </Suspense>
        ),
      },
      {
        path: "sampleProfile",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <FreelancerProfile />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: "my-profile",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: "profile/:username",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <UserProfile />
          </Suspense>
        ),
      },

      // Dashboard and User Pages
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "messages",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Messages />
          </Suspense>
        ),
      },
      {
        path: "messages/:userId",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Messages />
          </Suspense>
        ),
      },
      {
        path: "orders",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Orders />
          </Suspense>
        ),
      },
      {
        path: "order/:id",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <OrderDetails />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Notifications />
          </Suspense>
        ),
      },
      {
        path: "favorites",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Favorites />
          </Suspense>
        ),
      },

      // Gig Management (Freelancers)
      {
        path: "create-gig",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <CreateGig />
          </Suspense>
        ),
      },
      {
        path: "my-gigs",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <MyGigs />
          </Suspense>
        ),
      },
      {
        path: "edit-gig/:id",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <CreateGig />
          </Suspense>
        ),
      },
      {
        path: "checkout/:gigId",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Checkout />
          </Suspense>
        ),
      },

      // Post Management
      {
        path: "create-post",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <CreatePost />
          </Suspense>
        ),
      },
      {
        path: "edit-post/:id",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <CreatePost />
          </Suspense>
        ),
      },
      {
        path: "posts/:id",
        element: (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <PostDetail />
          </Suspense>
        ),
      },

      // Admin Panel
      {
        path: "admin",
        element: (
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <AdminOverviewPage />
              </Suspense>
            ),
          },
          {
            path: "users",
            element: (
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <AdminUsersPage />
              </Suspense>
            ),
          },
          {
            path: "control",
            element: (
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <AdminControlPage />
              </Suspense>
            ),
          },
          {
            path: "listings",
            element: (
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <AdminListingsPage />
              </Suspense>
            ),
          },
          {
            path: "categories",
            element: (
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <AdminCategoriesPage />
              </Suspense>
            ),
          },
          {
            path: "orders",
            element: (
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <AdminOrdersPage />
              </Suspense>
            ),
          },
          {
            path: "reviews",
            element: (
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <AdminReviewsPage />
              </Suspense>
            ),
          },
          {
            path: "news",
            element: (
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <AdminNewsPage />
              </Suspense>
            ),
          },
          {
            path: "settings",
            element: (
              <Suspense fallback={<LoadingSpinner size="lg" />}>
                <AdminSettingsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
