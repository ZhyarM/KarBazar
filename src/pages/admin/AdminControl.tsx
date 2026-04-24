import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

function AdminControlPage() {
  const { t } = useLanguage();

  const sections = [
    {
      title: t("admin.control.section.listingsTitle"),
      description: t("admin.control.section.listingsDescription"),
      to: "/admin/listings",
    },
    {
      title: t("admin.control.section.dealsTitle"),
      description: t("admin.control.section.dealsDescription"),
      to: "/admin/deals",
    },
    {
      title: t("admin.control.section.ordersTitle"),
      description: t("admin.control.section.ordersDescription"),
      to: "/admin/orders",
    },
    {
      title: t("admin.control.section.settingsTitle"),
      description: t("admin.control.section.settingsDescription"),
      to: "/admin/settings",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text)">
          {t("admin.control.title")}
        </h2>
        <p className="text-(--color-text-muted) mt-2">
          {t("admin.control.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link
            key={section.title}
            to={section.to}
            className="bg-(--color-surface) rounded-lg p-5 shadow-md border border-(--color-border) hover:border-(--color-primary) transition-colors"
          >
            <h3 className="text-lg font-semibold text-(--color-text)">
              {section.title}
            </h3>
            <p className="text-(--color-text-muted) mt-2 text-sm">
              {section.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <p className="text-(--color-text-muted)">
          {t("admin.control.additionalTools")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/admin/users"
            className="inline-block px-4 py-2 rounded-md bg-(--color-primary) text-white font-semibold hover:opacity-90 transition-opacity"
          >
            {t("admin.users.title")}
          </Link>
          <Link
            to="/admin/news"
            className="inline-block px-4 py-2 rounded-md border border-(--color-border) text-(--color-text) font-semibold"
          >
            {t("admin.news.publishTitle")}
          </Link>
          <Link
            to="/admin/deals"
            className="inline-block px-4 py-2 rounded-md border border-(--color-border) text-(--color-text) font-semibold"
          >
            {t("admin.deals.title")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminControlPage;
