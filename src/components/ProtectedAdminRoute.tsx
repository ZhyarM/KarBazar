import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import me from "../API/me";
import { isAuthenticated } from "../API/apiClient";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const hasToken = useMemo(() => isAuthenticated(), []);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!hasToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await me();
        const role = response?.data?.role;
        setIsAdmin(role === "admin");
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [hasToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-(--color-bg)">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  if (!hasToken) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedAdminRoute;
