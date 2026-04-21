

import AdminLayout from './../admin/AdminLayout.tsx';
import Overview from './../admin/Overview.tsx';
import RevenueAnalytics from './../admin/RevenueAnalytics.tsx';
import OrderAnalytics from './../admin/OrderAnalytics.tsx';
import TopServiceProviders from './../admin/TopServiceProviders.tsx';
import TopServices from './../admin/TopServices.tsx';
import Categories from '../admin/Categories.tsx';
import RecentActivities from './../admin/RecentActivities.tsx';

export const adminRoutes = {
    path: "/admin",
    element: <AdminLayout />,
    children: [
        {index: true, element: <Overview />},
        { path: "revenue", element: <RevenueAnalytics /> },
        { path: "orders", element: <OrderAnalytics /> },
        { path: "service-providers", element: <TopServiceProviders /> },
        { path: "services", element: <TopServices /> },
        { path: "categories", element: <Categories /> },
        { path: "activities", element: <RecentActivities /> },
    ]
}