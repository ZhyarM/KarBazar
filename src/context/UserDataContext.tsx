import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import me, { type AuthResponse } from "../API/me.tsx";
import { getUnreadCount } from "../API/NotificationsAPI.ts";
import { clearAuthStorage, isAuthenticated } from "../API/apiClient.ts";

type UserDataContextType = {
  user: AuthResponse | null;
  authLoading: boolean;
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined,
);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated()) {
      setUnreadCount(0);
      return;
    }

    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to get unread count:", error);
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    setAuthLoading(true);

    if (!isAuthenticated()) {
      setUser(null);
      setUnreadCount(0);
      setAuthLoading(false);
      return;
    }

    try {
      const currentUser = await me();
      setUser(currentUser);
      await refreshUnreadCount();
    } catch (error) {
      setUser(null);
      setUnreadCount(0);
      clearAuthStorage();
      console.error("Failed to get user data:", error);
    } finally {
      setAuthLoading(false);
    }
  }, [refreshUnreadCount]);

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      if (!isMounted) {
        return;
      }

      await refreshUserData();
    };

    const syncOnVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshUnreadCount();
      }
    };

    const syncAuthState = () => {
      void loadUserData();
    };

    loadUserData();
    document.addEventListener("visibilitychange", syncOnVisibility);
    window.addEventListener("auth-changed", syncAuthState);

    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refreshUnreadCount();
      }
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(poll);
      document.removeEventListener("visibilitychange", syncOnVisibility);
      window.removeEventListener("auth-changed", syncAuthState);
    };
  }, [refreshUnreadCount, refreshUserData]);

  const value = useMemo(
    () => ({
      user,
      authLoading,
      unreadCount,
      refreshUnreadCount,
      refreshUserData,
    }),
    [user, authLoading, unreadCount, refreshUnreadCount, refreshUserData],
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within UserDataProvider");
  }
  return context;
}
