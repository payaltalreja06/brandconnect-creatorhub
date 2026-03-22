import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { messageApi } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useAuth } from "./AuthContext";

interface Thread {
  _id: string;
  participants: string[];
  unreadCount: Record<string, number>;
}

interface ChatContextType {
  totalUnreadCount: number;
  threads: Thread[];
  fetchThreads: () => Promise<void>;
  markAllSeen: (threadId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  totalUnreadCount: 0,
  threads: [],
  fetchThreads: async () => {},
  markAllSeen: async () => {},
});

export const useChatCount = () => useContext(ChatContext);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const fetchThreads = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await messageApi.getThreads();
      const fetched: Thread[] = res.data || [];
      setThreads(fetched);
      
      const unread = fetched.reduce((sum, t) => sum + (t.unreadCount[user?.id || ""] || 0), 0);
      setTotalUnreadCount(unread);
    } catch {
      // silent
    }
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    if (isLoggedIn) fetchThreads();
  }, [isLoggedIn, fetchThreads]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const socket = getSocket();

    const handleNewMessage = (msg: any) => {
      // Only increment if not from us
      if (msg.senderId !== user?.id) {
        setTotalUnreadCount(prev => prev + 1);
        // Also update threads list if needed (optional since ChatInterface does its own)
      }
    };

    const handleChatUnlocked = () => {
      fetchThreads();
    };

    socket.on("new_message", handleNewMessage);
    socket.on("chat_unlocked", handleChatUnlocked);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("chat_unlocked", handleChatUnlocked);
    };
  }, [isLoggedIn, user?.id, fetchThreads]);

  const markAllSeen = async (threadId: string) => {
    try {
      await messageApi.markAllSeen(threadId);
      // Recalculate unread locally
      setThreads(prev => {
        const updated = prev.map(t => t._id === threadId ? { ...t, unreadCount: { ...t.unreadCount, [user?.id || ""]: 0 } } : t);
        const unread = updated.reduce((sum, t) => sum + (t.unreadCount[user?.id || ""] || 0), 0);
        setTotalUnreadCount(unread);
        return updated;
      });
    } catch {
      // silent
    }
  };

  return (
    <ChatContext.Provider value={{ totalUnreadCount, threads, fetchThreads, markAllSeen }}>
      {children}
    </ChatContext.Provider>
  );
}
