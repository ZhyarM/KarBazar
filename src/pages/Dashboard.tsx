import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../API/OrdersAPI";
import type { Order } from "../API/OrdersAPI";
import { getMyGigs } from "../API/GigsAPI";
import type { Gig } from "../API/GigsAPI";
import { getUnreadCount } from "../API/NotificationsAPI";
import { getImageUrl } from "../utils/imageUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faBriefcase,
  faBell,
  faEnvelope,
  faDollarSign,
  faStar,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isFreelancer =
    currentUser.role === "freelancer" || currentUser.role === "business";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ordersData, unreadCount] = await Promise.all([
        getOrders(),
        getUnreadCount(),
      ]);

      setOrders(ordersData);
      setUnreadNotifications(unreadCount);

      if (isFreelancer) {
        const gigsData = await getMyGigs();
        setGigs(gigsData);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const buyingOrders = orders.filter((o) => o.buyer_id === currentUser.id);
  const sellingOrders = orders.filter((o) => o.seller_id === currentUser.id);
  const activeOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "in_progress",
  );

  const calculateEarnings = () => {
    return sellingOrders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.price, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-bg) py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-(--color-text) mb-2">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-(--color-text-muted)">
            Here's what's happening with your{" "}
            {isFreelancer ? "business" : "orders"} today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-(--color-surface) rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-3xl text-(--color-primary)"
              />
              <span className="text-3xl font-bold text-(--color-text)">
                {activeOrders.length}
              </span>
            </div>
            <h3 className="text-(--color-text-muted) font-semibold">
              Active Orders
            </h3>
          </div>

          {isFreelancer && (
            <>
              <div className="bg-(--color-surface) rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className="text-3xl text-blue-600"
                  />
                  <span className="text-3xl font-bold text-(--color-text)">
                    {gigs.length}
                  </span>
                </div>
                <h3 className="text-(--color-text-muted) font-semibold">
                  Total Gigs
                </h3>
              </div>

              <div className="bg-(--color-surface) rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="text-3xl text-green-600"
                  />
                  <span className="text-3xl font-bold text-(--color-text)">
                    ${calculateEarnings()}
                  </span>
                </div>
                <h3 className="text-(--color-text-muted) font-semibold">
                  Total Earnings
                </h3>
              </div>
            </>
          )}

          <div className="bg-(--color-surface) rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FontAwesomeIcon
                icon={faBell}
                className="text-3xl text-orange-600"
              />
              <span className="text-3xl font-bold text-(--color-text)">
                {unreadNotifications}
              </span>
            </div>
            <h3 className="text-(--color-text-muted) font-semibold">
              Notifications
            </h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-(--color-surface) rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-2xl font-bold text-(--color-text) mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isFreelancer && (
              <Link
                to="/create-gig"
                className="flex items-center gap-3 p-4 bg-(--color-bg) rounded-lg hover:bg-(--color-primary) hover:text-white transition-all group"
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-2xl group-hover:text-white"
                />
                <span className="font-semibold">Create New Gig</span>
              </Link>
            )}
            <Link
              to="/browse-gigs"
              className="flex items-center gap-3 p-4 bg-(--color-bg) rounded-lg hover:bg-(--color-primary) hover:text-white transition-all group"
            >
              <FontAwesomeIcon
                icon={faBriefcase}
                className="text-2xl group-hover:text-white"
              />
              <span className="font-semibold">Browse Gigs</span>
            </Link>
            <Link
              to="/messages"
              className="flex items-center gap-3 p-4 bg-(--color-bg) rounded-lg hover:bg-(--color-primary) hover:text-white transition-all group"
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-2xl group-hover:text-white"
              />
              <span className="font-semibold">Messages</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-3 p-4 bg-(--color-bg) rounded-lg hover:bg-(--color-primary) hover:text-white transition-all group"
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-2xl group-hover:text-white"
              />
              <span className="font-semibold">View Orders</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-(--color-text)">
                Recent Orders
              </h2>
              <Link
                to="/orders"
                className="text-(--color-primary) hover:underline"
              >
                View All
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8 text-(--color-text-muted)">
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-4 bg-(--color-bg) rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={getImageUrl(order.gig.image_url)}
                      alt={order.gig.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-(--color-text) truncate">
                        {order.gig.title}
                      </h3>
                      <p className="text-sm text-(--color-text-muted)">
                        {order.buyer_id === currentUser.id
                          ? "Buying"
                          : "Selling"}{" "}
                        • ${order.price}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Gigs (Freelancer) or Browse Recommendations (Client) */}
          {isFreelancer ? (
            <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-(--color-text)">
                  My Gigs
                </h2>
                <Link
                  to="/my-gigs"
                  className="text-(--color-primary) hover:underline"
                >
                  View All
                </Link>
              </div>

              {gigs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-(--color-text-muted) mb-4">
                    You haven't created any gigs yet
                  </p>
                  <Link
                    to="/create-gig"
                    className="inline-block px-6 py-3 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all"
                  >
                    Create Your First Gig
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {gigs.slice(0, 5).map((gig) => (
                    <div
                      key={gig.id}
                      className="flex items-center gap-4 p-4 bg-(--color-bg) rounded-lg hover:shadow-md transition-shadow"
                    >
                      <img
                        src={getImageUrl(gig.image_url)}
                        alt={gig.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-(--color-text) truncate">
                          {gig.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-(--color-text-muted)">
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon
                              icon={faStar}
                              className="text-yellow-500"
                            />
                            {gig.rating}
                          </span>
                          <span>{gig.total_orders} orders</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-(--color-primary)">
                          ${gig.starting_price}
                        </p>
                        <p className="text-xs text-(--color-text-muted)">
                          starting at
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-(--color-text) mb-4">
                Performance Stats
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-(--color-text)">Orders Placed</span>
                    <span className="font-bold text-(--color-text)">
                      {buyingOrders.length}
                    </span>
                  </div>
                  <div className="h-2 bg-(--color-bg) rounded-full overflow-hidden">
                    <div
                      className="h-full bg-(--color-primary)"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-(--color-text)">
                      Completed Orders
                    </span>
                    <span className="font-bold text-(--color-text)">
                      {
                        buyingOrders.filter((o) => o.status === "completed")
                          .length
                      }
                    </span>
                  </div>
                  <div className="h-2 bg-(--color-bg) rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-(--color-text)">Active Orders</span>
                    <span className="font-bold text-(--color-text)">
                      {
                        buyingOrders.filter((o) => o.status === "in_progress")
                          .length
                      }
                    </span>
                  </div>
                  <div className="h-2 bg-(--color-bg) rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
