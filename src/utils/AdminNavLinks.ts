type AdminNavLinkItem = { label: string; to: string };

const adminNavLinks: AdminNavLinkItem[] = [
  { label: "Overview", to: "/admin" },
  { label: "Revenue Analytics", to: "/admin/revenue" },
  { label: "Order Analytics", to: "/admin/orders" },
  { label: "Service Providers", to: "/admin/service-providers" },
  { label: "Services", to: "/admin/services" },
  { label: "Categories", to: "/admin/categories" },
  { label: "Recent Activities", to: "/admin/activities" },
];

export default adminNavLinks;
