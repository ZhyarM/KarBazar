import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  faBriefcase,
  faDollarSign,
  faLayerGroup,
  faListCheck,
  faShieldHalved,
  faShoppingCart,
  faStar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getAdminDashboard,
  type AdminActivity,
  type AdminChartPoint,
  type AdminDashboardResponse,
  type AdminTopFreelancer,
  type AdminTopGig,
} from "../../API/AdminAPI";
import { useLanguage } from "../../context/LanguageContext";

function formatCompact(value: number): string {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function StatCard({
  label,
  value,
  icon,
  tone,
  subtitle,
}: {
  label: string;
  value: string;
  icon: any;
  tone: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-(--color-surface) rounded-xl p-5 shadow-md border border-(--color-border)">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-(--color-text-muted)">{label}</p>
          <p className="mt-2 text-3xl font-bold text-(--color-text)">{value}</p>
          {subtitle ? (
            <p className="mt-1 text-xs text-(--color-text-muted)">{subtitle}</p>
          ) : null}
        </div>
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center ${tone}`}
        >
          <FontAwesomeIcon icon={icon} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function MiniBarChart({
  title,
  data,
  accentClass,
  formatter,
}: {
  title: string;
  data: AdminChartPoint[];
  accentClass: string;
  formatter?: (value: number) => string;
}) {
  const visibleData = data.slice(-12);
  const maxValue = Math.max(...visibleData.map((entry) => entry.value), 1);

  return (
    <div className="bg-(--color-surface) rounded-xl p-5 shadow-md border border-(--color-border)">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-(--color-text)">{title}</h3>
        <span className="text-xs text-(--color-text-muted)">Last 30 days</span>
      </div>
      <div className="h-48 flex items-end gap-2">
        {visibleData.map((entry) => {
          const height = (entry.value / maxValue) * 100;

          return (
            <div
              key={`${title}-${entry.label}`}
              className="flex-1 flex flex-col items-center gap-2 h-full"
            >
              <div className="flex-1 flex items-end w-full">
                <div
                  className={`w-full rounded-t-md ${accentClass}`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={`${entry.label}: ${formatter ? formatter(entry.value) : entry.value}`}
                />
              </div>
              <span className="text-[10px] text-(--color-text-muted) whitespace-nowrap">
                {entry.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListCard<T extends { id: number }>({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
}) {
  return (
    <div className="bg-(--color-surface) rounded-xl p-5 shadow-md border border-(--color-border)">
      <h3 className="text-lg font-semibold text-(--color-text) mb-4">
        {title}
      </h3>
      <div className="space-y-3">{items.slice(0, 5).map(renderItem)}</div>
    </div>
  );
}

function AdminOverviewPage() {
  const { t } = useLanguage();
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(
    null,
  );
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminDashboard();
        setDashboard(data);
        setActivities(data.tables.recent_activities);
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

  if (!dashboard) {
    return (
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md text-(--color-text-muted)">
        {t("admin.overview.loadFailed")}
      </div>
    );
  }

  const dashboardStats = dashboard.stats;
  const { charts, tables } = dashboard;

  const statCards = [
    {
      icon: faUsers,
      label: t("admin.overview.totalUsers"),
      value: formatCompact(dashboardStats.total_users),
      tone: "bg-slate-700",
    },
    {
      icon: faBriefcase,
      label: t("admin.overview.activeGigs"),
      value: formatCompact(dashboardStats.active_gigs),
      tone: "bg-blue-700",
    },
    {
      icon: faShoppingCart,
      label: t("admin.overview.totalOrders"),
      value: formatCompact(dashboardStats.total_orders),
      tone: "bg-orange-700",
    },
    {
      icon: faLayerGroup,
      label: "Total Categories",
      value: formatCompact(dashboardStats.total_categories),
      tone: "bg-violet-700",
    },
    {
      icon: faListCheck,
      label: "Pending Orders",
      value: formatCompact(dashboardStats.pending_orders),
      tone: "bg-rose-700",
    },
    {
      icon: faStar,
      label: t("admin.overview.averageRating"),
      value: dashboardStats.average_rating.toFixed(1),
      tone: "bg-amber-600",
    },
    {
      icon: faDollarSign,
      label: "Revenue",
      value: formatCurrency(dashboardStats.total_revenue),
      tone: "bg-emerald-700",
      subtitle: `Platform fee: ${dashboardStats.current_platform_fee}%`,
    },
    {
      icon: faShieldHalved,
      label: "Maintenance",
      value: dashboardStats.maintenance_mode ? "On" : "Off",
      tone: dashboardStats.maintenance_mode ? "bg-red-700" : "bg-green-700",
      subtitle: dashboardStats.maintenance_mode
        ? "Non-admin API requests are blocked"
        : "Public API requests are open",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={String(stat.value)}
            icon={stat.icon}
            tone={stat.tone}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MiniBarChart
          title="Revenue"
          data={charts.revenue}
          accentClass="bg-emerald-600"
          formatter={formatCurrency}
        />
        <MiniBarChart
          title="Orders"
          data={charts.orders}
          accentClass="bg-orange-600"
          formatter={(value) => formatCompact(value)}
        />
        <MiniBarChart
          title="Categories"
          data={charts.categories}
          accentClass="bg-violet-600"
          formatter={(value) => formatCompact(value)}
        />
        <MiniBarChart
          title="Top Freelancers"
          data={charts.freelancers.map((entry) => ({
            label: entry.username || entry.name,
            value: entry.total_earnings,
          }))}
          accentClass="bg-sky-600"
          formatter={formatCurrency}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ListCard<AdminTopFreelancer>
          title="Top Freelancers"
          items={tables.top_freelancers}
          renderItem={(item) => (
            <div
              key={item.id}
              className="border border-(--color-border) rounded-lg p-3 bg-(--color-bg)"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-(--color-text)">
                    {item.name}
                  </p>
                  <p className="text-xs text-(--color-text-muted)">
                    {item.username || item.email}
                  </p>
                </div>
                <span className="text-sm font-semibold text-(--color-text)">
                  {formatCurrency(item.total_earnings)}
                </span>
              </div>
              <p className="mt-2 text-xs text-(--color-text-muted)">
                {item.total_orders} orders · Rating {item.rating.toFixed(1)}
              </p>
            </div>
          )}
        />

        <ListCard<AdminTopGig>
          title="Top Gigs"
          items={tables.top_gigs}
          renderItem={(item) => (
            <div
              key={item.id}
              className="border border-(--color-border) rounded-lg p-3 bg-(--color-bg)"
            >
              <p className="font-semibold text-(--color-text)">{item.title}</p>
              <p className="text-xs text-(--color-text-muted)">
                {item.seller} · {item.category}
              </p>
              <p className="mt-2 text-xs text-(--color-text-muted)">
                {item.total_orders} orders · {item.review_count} reviews ·{" "}
                {formatCurrency(item.price)}
              </p>
            </div>
          )}
        />

        <div className="bg-(--color-surface) rounded-xl p-5 shadow-md border border-(--color-border)">
          <h3 className="text-lg font-semibold text-(--color-text) mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-sm text-(--color-text-muted)">
                No activity yet.
              </p>
            ) : (
              activities.slice(0, 5).map((activity, index) => (
                <div
                  key={`${activity.date}-${index}`}
                  className="rounded-lg border border-(--color-border) bg-(--color-bg) p-3"
                >
                  <p className="text-sm text-(--color-text)">
                    {activity.message}
                  </p>
                  <p className="mt-1 text-xs text-(--color-text-muted)">
                    {new Date(activity.date).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverviewPage;
