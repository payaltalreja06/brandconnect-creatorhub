import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { notificationApi, requestApi } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useAuth } from "./AuthContext";

export interface Notification {
  _id: string;
  userId: string;
  type: "collab_request" | "pitch" | "request_accepted" | "request_declined" | "new_message" | "payment" | "campaign" | "system";
  title: string;
  description: string;
  fromName: string;
  fromAvatar: string;
  relatedId: string | null;
  read: boolean;
  createdAt: string;
}

interface CollabRequest {
  _id: string;
  fromUserId: string;
  fromName: string;
  fromAvatar: string;
  fromRole: string;
  toUserId: string;
  campaignName: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  threadId: string | null;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  collabRequests: CollabRequest[];
  pendingRequestsCount: number;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<{ threadId: string }>;
  declineRequest: (requestId: string) => Promise<void>;
  fetchRequests: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  collabRequests: [],
  pendingRequestsCount: 0,
  fetchNotifications: async () => {},
  markRead: async () => {},
  markAllRead: async () => {},
  acceptRequest: async () => ({ threadId: "" }),
  declineRequest: async () => {},
  fetchRequests: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [collabRequests, setCollabRequests] = useState<CollabRequest[]>([]);

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await notificationApi.getAll();
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch {
      // silent fail
    }
  }, [isLoggedIn]);

  const fetchRequests = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await requestApi.getAll("received");
      setCollabRequests(res.data || []);
    } catch {
      // silent fail
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      fetchRequests();
    }
  }, [isLoggedIn, fetchNotifications, fetchRequests]);

  // Listen for real-time notifications via socket
  useEffect(() => {
    if (!isLoggedIn) return;
    const socket = getSocket();

    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [isLoggedIn]);

  const markRead = async (id: string) => {
    try {
      await notificationApi.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // silent fail
    }
  };

  const markAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // silent fail
    }
  };

  const acceptRequest = async (requestId: string): Promise<{ threadId: string }> => {
    const res = await requestApi.accept(requestId);
    await fetchRequests();
    await fetchNotifications();
    return { threadId: res.data.thread._id };
  };

  const declineRequest = async (requestId: string) => {
    await requestApi.decline(requestId);
    await fetchRequests();
    await fetchNotifications();
  };

  const pendingRequestsCount = collabRequests.filter(r => r.status === "pending").length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      collabRequests,
      pendingRequestsCount,
      fetchNotifications,
      markRead,
      markAllRead,
      acceptRequest,
      declineRequest,
      fetchRequests,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
