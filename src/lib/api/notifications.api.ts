import axios from "./axios";

export interface AdminNotification {
  _id: string;
  title: string;
  message: string;
  category: "SYSTEM" | "ALERT" | "MATCH" | "MESSAGE";
  isRead: boolean;
  createdAt: string;
}

const NOTIFICATIONS_BASE_URL = "/notifications";

export const notificationsApi = {
  // Fetch notifications for current user
  getNotifications: async (limit = 10): Promise<AdminNotification[]> => {
    try {
      console.log("[Notifications API] Fetching notifications...");
      const response = await axios.get<{ data: { notifications: AdminNotification[] } }>(
        `${NOTIFICATIONS_BASE_URL}?limit=${limit}`
      );
      console.log("[Notifications API] Received notifications:", response.data.data?.notifications?.length || 0);
      return response.data.data?.notifications || [];
    } catch (error) {
      console.error("[Notifications API] Error fetching notifications:", error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    try {
      await axios.patch(`${NOTIFICATIONS_BASE_URL}/${notificationId}/read`);
    } catch (error) {
      console.error("[Notifications API] Error marking as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    try {
      await axios.patch(`${NOTIFICATIONS_BASE_URL}/mark-all`);
    } catch (error) {
      console.error("[Notifications API] Error marking all as read:", error);
      throw error;
    }
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    try {
      console.log("[Notifications API] Fetching unread count...");
      const response = await axios.get<{ data: { unreadCount: number } }>(
        `${NOTIFICATIONS_BASE_URL}/unread-count`
      );
      console.log("[Notifications API] Unread count:", response.data.data?.unreadCount || 0);
      return response.data.data?.unreadCount || 0;
    } catch (error) {
      console.error("[Notifications API] Error fetching unread count:", error);
      throw error;
    }
  },
};
