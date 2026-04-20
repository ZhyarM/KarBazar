import { useEffect, useState } from "react";
import {
  faUsers,
  faBriefcase,
  faShoppingCart,
  faListCheck,
  faStar,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getAdminOverview,
  getRecentAdminActivities,
  type AdminActivity,
  type AdminOverview,
} from "../../API/AdminAPI";
import { useLanguage } from "../../context/LanguageContext";

function AdminOverviewPage() {
  const { t } = useLanguage();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [overviewData, activitiesData] = await Promise.all([
          getAdminOverview(),
          getRecentAdminActivities(),
        ]);

        setOverview(overviewData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Failed to load admin overview:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md text-(--color-text-muted)">
        {t("admin.overview.loadFailed")}
      </div>
    );
  }

  const stats = [
    {
      icon: faUsers,
      label: t("admin.overview.totalUsers"),
      value: overview.total_users,
      iconColor: "text-(--color-primary)",
    },
    {
      icon: faBriefcase,
      label: t("admin.overview.activeGigs"),
      value: overview.active_gigs,
      iconColor: "text-blue-600",
    },
    {
      icon: faShoppingCart,
      label: t("admin.overview.totalOrders"),
      value: overview.total_orders,
      iconColor: "text-orange-600",
    },
    {
      icon: faLayerGroup,
      label: "Total Categories",
      value: overview.total_categories,
      iconColor: "text-purple-600",
    },
    {
      icon: faListCheck,
      label: "Pending Orders",
      value: overview.pending_orders,
      iconColor: "text-rose-600",
    },
    {
      icon: faStar,
      label: t("admin.overview.averageRating"),
      value: overview.average_rating,
      iconColor: "text-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-(--color-surface) rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <FontAwesomeIcon
                icon={stat.icon}
                className={`text-2xl ${stat.iconColor}`}
              />
              <span className="text-3xl font-bold text-(--color-text)">
                {stat.value}
              </span>
            </div>
            <h3 className="text-(--color-text-muted) font-semibold">
              {stat.label}
            </h3>
          </div>
        ))}
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text) mb-4">
          Admin Abilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Manage all users",
            "Moderate listings",
            "Manage categories",
            "View all orders",
            "Moderate reviews",
            "Manage deals",
            "Publish news",
            "View analytics",
            "Process role requests",
            "Configure platform settings",
            "Audit admin actions",
            "Handle account safety",
          ].map((ability) => (
            <div
              key={ability}
              className="border border-(--color-border) rounded-md px-3 py-2 text-sm text-(--color-text) bg-(--color-bg)"
            >
              {ability}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text) mb-4">
          {t("admin.overview.recentActivity")}
        </h2>

        {activities.length === 0 ? (
          <p className="text-(--color-text-muted)">
            {t("admin.overview.noActivity")}
          </p>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 10).map((activity, index) => (
              <div
                key={`${activity.date}-${index}`}
                className="p-3 rounded-lg bg-(--color-bg) border border-(--color-border)"
              >
                <p className="text-(--color-text)">{activity.message}</p>
                <p className="text-xs text-(--color-text-muted) mt-1">
                  {new Date(activity.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOverviewPage;
