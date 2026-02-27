import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} from "../API/NotificationsAPI";
import type { Notification } from "../API/NotificationsAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheck,
  faTrash,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      await loadNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      await loadNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const filteredNotifications = notifications.filter((notif) =>
    filter === "all" ? true : !notif.read_at,
  );

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-(--color-text) flex items-center gap-2">
            <FontAwesomeIcon icon={faBell} className="text-(--color-primary)" />
            Notifications
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-(--color-primary) text-white rounded-full text-sm">
                {unreadCount}
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faCheckDouble} />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "all"
                ? "bg-(--color-primary) text-white"
                : "bg-(--color-surface) text-(--color-text)"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "unread"
                ? "bg-(--color-primary) text-white"
                : "bg-(--color-surface) text-(--color-text)"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-(--color-surface) rounded-lg">
            <FontAwesomeIcon
              icon={faBell}
              className="text-6xl text-(--color-text-muted) mb-4"
            />
            <p className="text-xl text-(--color-text-muted)">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-(--color-surface) rounded-lg p-4 shadow-md hover:shadow-lg transition-all ${
                  !notif.read_at ? "border-l-4 border-(--color-primary)" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-(--color-text)">
                        {notif.title}
                      </h3>
                      <span className="text-xs text-(--color-text-muted) whitespace-nowrap">
                        {formatTime(notif.created_at)}
                      </span>
                    </div>
                    <p className="text-(--color-text-muted) text-sm">
                      {notif.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!notif.read_at && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                        title="Mark as read"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
