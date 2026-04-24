import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./../pages/ErrorPages/ErrorPage.tsx";
import Root from "./Root.tsx";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute.tsx";
import AdminLayout from "../pages/admin/AdminLayout.tsx";
import LoadingCircle from "../utils/loading.tsx";

const Home = lazy(() => import("./../pages/Home.tsx"));
const Categories = lazy(() => import("./../pages/Categories.tsx"));
const BrowseGigs = lazy(() => import("../pages/BrowseGigs.tsx"));
const Deals = lazy(() => import("../pages/Deals.tsx"));
const About = lazy(() => import("./../pages/About.tsx"));
const Contact = lazy(() => import("./../pages/Contact.tsx"));
const FAQ = lazy(() => import("./../pages/FAQ.tsx"));
const Careers = lazy(() => import("./../pages/Careers.tsx"));
const PressNews = lazy(() => import("./../pages/PressNews.tsx"));
const HelpSupport = lazy(() => import("./../pages/HelpSupport.tsx"));
const TrustSafety = lazy(() => import("./../pages/TrustSafety.tsx"));
const SellingOnKarBazar = lazy(
  () => import("./../pages/SellingOnKarBazar.tsx"),
);
const BuyingOnKarBazar = lazy(
  () => import("./../pages/BuyingOnKarBazar.tsx"),
);
const TermsOfService = lazy(() => import("./../pages/TermsOfService.tsx"));
const SignIn = lazy(() => import("./../pages/auth/SignIn.tsx"));
const SignUp = lazy(() => import("./../pages/auth/SignUp.tsx"));
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
const AdminDealsPage = lazy(() => import("../pages/admin/AdminDeals.tsx"));
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

const withSuspense = (element: React.ReactElement) => (
  <Suspense fallback={<LoadingCircle size={8} />}>{element}</Suspense>
);

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    element: <Root />,
    errorElement: (
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: "browseGigs", element: withSuspense(<BrowseGigs />) },
      { path: "browse-gigs", element: withSuspense(<BrowseGigs />) },
      { path: "deals", element: withSuspense(<Deals />) },
      { path: "search", element: withSuspense(<SearchResults />) },
      { path: "/user/:userId", element: withSuspense(<UserDetails />) },
      { path: "/gig/:id", element: withSuspense(<UserDetails />) },
      { path: "/gigs/:id", element: withSuspense(<UserDetails />) },
      { path: "categories", element: withSuspense(<Categories />) },
      { path: "about", element: withSuspense(<About />) },
      { path: "contact", element: withSuspense(<Contact />) },
      { path: "faq", element: withSuspense(<FAQ />) },
      { path: "careers", element: withSuspense(<Careers />) },
      { path: "press-news", element: withSuspense(<PressNews />) },
      { path: "help-support", element: withSuspense(<HelpSupport />) },
      { path: "trust-safety", element: withSuspense(<TrustSafety />) },
      {
        path: "selling-on-karbazar",
        element: withSuspense(<SellingOnKarBazar />),
      },
      {
        path: "buying-on-karbazar",
        element: withSuspense(<BuyingOnKarBazar />),
      },
      { path: "terms-of-service", element: withSuspense(<TermsOfService />) },
      { path: "sign-in", element: withSuspense(<SignIn />) },
      { path: "auth/signin", element: withSuspense(<SignIn />) },
      { path: "auth/login", element: withSuspense(<SignIn />) },
      { path: "sign-up", element: withSuspense(<SignUp />) },
      { path: "auth/register", element: withSuspense(<SignUp />) },
      { path: "sampleProfile", element: withSuspense(<FreelancerProfile />) },
      { path: "profile", element: withSuspense(<UserProfile />) },
      { path: "my-profile", element: withSuspense(<UserProfile />) },
      { path: "profile/:username", element: withSuspense(<UserProfile />) },

      // Dashboard and User Pages
      { path: "dashboard", element: withSuspense(<Dashboard />) },
      { path: "messages", element: withSuspense(<Messages />) },
      { path: "messages/:userId", element: withSuspense(<Messages />) },
      { path: "orders", element: withSuspense(<Orders />) },
      { path: "order/:id", element: withSuspense(<OrderDetails />) },
      { path: "notifications", element: withSuspense(<Notifications />) },
      { path: "favorites", element: withSuspense(<Favorites />) },

      // Gig Management (Freelancers)
      { path: "create-gig", element: withSuspense(<CreateGig />) },
      { path: "my-gigs", element: withSuspense(<MyGigs />) },
      { path: "edit-gig/:id", element: withSuspense(<CreateGig />) },
      { path: "checkout/:gigId", element: withSuspense(<Checkout />) },

      // Post Management
      { path: "create-post", element: withSuspense(<CreatePost />) },
      { path: "edit-post/:id", element: withSuspense(<CreatePost />) },
      { path: "posts/:id", element: withSuspense(<PostDetail />) },

      // Admin Panel
      {
        path: "admin",
        element: (
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        ),
        children: [
          { index: true, element: withSuspense(<AdminOverviewPage />) },
          { path: "users", element: withSuspense(<AdminUsersPage />) },
          { path: "control", element: withSuspense(<AdminControlPage />) },
          { path: "listings", element: withSuspense(<AdminListingsPage />) },
          { path: "deals", element: withSuspense(<AdminDealsPage />) },
          {
            path: "categories",
            element: withSuspense(<AdminCategoriesPage />),
          },
          { path: "orders", element: withSuspense(<AdminOrdersPage />) },
          { path: "reviews", element: withSuspense(<AdminReviewsPage />) },
          { path: "news", element: withSuspense(<AdminNewsPage />) },
          { path: "settings", element: withSuspense(<AdminSettingsPage />) },
        ],
      },
    ],
  },
]);

export default router;
