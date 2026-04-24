import { NavLink, Outlet } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const navItems = [
  { to: "/admin", labelKey: "admin.nav.overview", end: true },
  { to: "/admin/users", labelKey: "admin.nav.users" },
  { to: "/admin/listings", labelKey: "admin.nav.listings" },
  { to: "/admin/deals", labelKey: "admin.nav.deals" },
  { to: "/admin/categories", labelKey: "admin.nav.categories" },
  { to: "/admin/orders", labelKey: "admin.nav.orders" },
  { to: "/admin/reviews", labelKey: "admin.nav.reviews" },
  { to: "/admin/news", labelKey: "admin.nav.news" },
  { to: "/admin/settings", labelKey: "admin.nav.settings" },
  { to: "/admin/control", labelKey: "admin.nav.control" },
];

function AdminLayout() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-(--color-bg) px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-(--color-text)">
            {t("admin.title")}
          </h1>
          <p className="text-(--color-text-muted) mt-2">
            {t("admin.subtitle")}
          </p>
        </div>

        <div className="bg-(--color-surface) rounded-lg shadow-md p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-(--color-primary) text-white"
                      : "text-(--color-text-muted) hover:bg-(--color-bg) hover:text-(--color-text)"
                  }`
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
