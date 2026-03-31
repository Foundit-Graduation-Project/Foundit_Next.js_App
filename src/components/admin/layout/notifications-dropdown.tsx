"use client";

import { useEffect, useState } from "react";
import { Bell, X, CheckCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationsApi, AdminNotification } from "@/lib/api/notifications.api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { connectSocket, getSocket } from "@/lib/socket";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/features/auth/authSelectors";

const CATEGORY_COLORS: Record<string, { bg: string; dot: string; text: string }> = {
  SYSTEM: { bg: "bg-blue-50", dot: "bg-blue-600", text: "text-blue-900" },
  ALERT: { bg: "bg-red-50", dot: "bg-red-600", text: "text-red-900" },
  MATCH: { bg: "bg-purple-50", dot: "bg-purple-600", text: "text-purple-900" },
  MESSAGE: { bg: "bg-green-50", dot: "bg-green-600", text: "text-green-900" },
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Listen for new notifications via socket
  useEffect(() => {
    if (!user) {
      console.log("[NotificationsDropdown] No user logged in");
      return;
    }

    console.log("[NotificationsDropdown] Setting up socket for user:", user.email, "role:", user.role);

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      console.log("[NotificationsDropdown] No access token found");
      return;
    }

    const socket = connectSocket(token);

    // Listen for new notifications
    socket?.on("new_notification", (notification: AdminNotification) => {
      console.log("[NotificationsDropdown] Received notification:", notification);
      console.log("[NotificationsDropdown] Current user:", user.email, "role:", user.role);
      
      // Add to the beginning of the list
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket?.off("new_notification");
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsApi.getNotifications(8);
      setNotifications(data);

      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error("Failed to mark notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <div
      className={`absolute right-0 top-14 mt-2 w-full max-w-sm sm:max-w-md md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 transition-all duration-200 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs gap-1 px-2 py-1 h-auto"
          >
            <CheckCheck className="w-3 h-3" />
            <span className="hidden sm:inline">Mark all</span>
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const colors = CATEGORY_COLORS[notification.category] || CATEGORY_COLORS.SYSTEM;

            return (
              <div
                key={notification._id}
                className={`p-3 sm:p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                  !notification.isRead 
                    ? "bg-blue-50/50 border-l-4 border-l-blue-500" 
                    : "opacity-75"
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${colors.dot}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="shrink-0 text-blue-600 hover:text-blue-700 text-xs font-semibold hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                        >
                          <span className="hidden sm:inline">Mark read</span>
                          <CheckCheck className="w-3 h-3 sm:hidden" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-2 sm:p-3 border-t border-gray-100 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              router.push("/admin/broadcasts");
              onClose();
            }}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs gap-1 w-full sm:w-auto"
          >
            View all notifications
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
