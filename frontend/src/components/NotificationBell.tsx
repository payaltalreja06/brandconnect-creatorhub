import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Check, CheckCheck, MessageCircle, Megaphone, IndianRupee, Handshake, X, UserCheck, UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

function getNotifIcon(type: Notification["type"]) {
  switch (type) {
    case "collab_request": return <Handshake className="w-4 h-4 text-orange-500" />;
    case "request_accepted": return <UserCheck className="w-4 h-4 text-green-500" />;
    case "request_declined": return <UserX className="w-4 h-4 text-red-500" />;
    case "new_message": return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case "payment": return <IndianRupee className="w-4 h-4 text-emerald-500" />;
    case "campaign": return <Megaphone className="w-4 h-4 text-purple-500" />;
    default: return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationBell() {
  const { notifications, unreadCount, collabRequests, markRead, markAllRead, acceptRequest, declineRequest } = useNotifications();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const pendingRequests = collabRequests.filter(r => r.status === "pending");

  const handleAccept = async (requestId: string) => {
    setLoadingId(requestId);
    try {
      const { threadId } = await acceptRequest(requestId);
      toast.success("Collaboration accepted! Chat is now unlocked 🎉");
      const path = role === "influencer" ? "/influencer/messages" : "/brand/messages";
      navigate(path);
      setIsOpen(false);
    } catch {
      toast.error("Failed to accept request");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setLoadingId(requestId);
    try {
      await declineRequest(requestId);
      toast.success("Request declined");
    } catch {
      toast.error("Failed to decline");
    } finally {
      setLoadingId(null);
    }
  };

  const handleNotifClick = async (notif: Notification) => {
    if (!notif.read) await markRead(notif._id);
    if (notif.type === "request_accepted" || notif.type === "new_message") {
      const path = role === "influencer" ? "/influencer/messages" : "/brand/messages";
      navigate(path);
      setIsOpen(false);
    }
  };

  const totalBadge = unreadCount + pendingRequests.length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-4 h-4" />
        {totalBadge > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {totalBadge > 9 ? "9+" : totalBadge}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 z-50 w-80 md:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Notifications</h3>
                  {totalBadge > 0 && (
                    <Badge variant="destructive" className="text-xs py-0">{totalBadge}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {notifications.some(n => !n.read) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7 px-2 text-primary hover:text-primary hover:bg-primary/10 transition-colors" 
                      onClick={(e) => { e.stopPropagation(); markAllRead(); }}
                    >
                      <CheckCheck className="w-3.5 h-3.5 mr-1" /> 
                      Mark all as read
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7 ml-1" onClick={() => setIsOpen(false)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="max-h-[420px] overflow-auto">
                {/* Pending Collaboration Requests */}
                {pendingRequests.length > 0 && (
                  <div className="p-3 border-b border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Collaboration Requests ({pendingRequests.length})
                    </p>
                    {pendingRequests.map((req) => (
                      <div key={req._id} className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30 mb-2">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/30 overflow-hidden flex-shrink-0 border border-orange-200 dark:border-orange-800/30 shadow-sm">
                            {req.fromAvatar ? (
                              <img src={req.fromAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-xs">
                                {req.fromName.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="font-bold text-sm text-foreground bg-primary/10 px-1 inline-block rounded mb-1">{req.fromName}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {(req.categories || []).map((cat: string) => (
                                    <span key={cat} className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tight shadow-sm border border-orange-200">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground/80 leading-relaxed">
                              Campaign: <span className="font-semibold text-orange-600 dark:text-orange-400">{req.campaignName}</span>
                            </p>
                            {req.message && (
                              <div className="mt-2 text-xs italic text-muted-foreground/70 bg-background/40 p-2 rounded border border-orange-100/30">
                                "{req.message}"
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700"
                            onClick={() => handleAccept(req._id)}
                            disabled={loadingId === req._id}
                          >
                            <UserCheck className="w-3 h-3 mr-1" />
                            Accept & Chat
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs text-red-500 border-red-300 hover:bg-red-50"
                            onClick={() => handleDecline(req._id)}
                            disabled={loadingId === req._id}
                          >
                            <UserX className="w-3 h-3 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notifications list */}
                {notifications.length === 0 && pendingRequests.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const isRequest = notif.type === "collab_request" || notif.type === "pitch";
                    // Find corresponding pending request if any
                    const pendingReq = isRequest ? collabRequests.find(r => r._id === notif.relatedId && r.status === "pending") : null;

                    return (
                      <div
                        key={notif._id}
                        onClick={() => !pendingReq && handleNotifClick(notif)}
                        className={`flex flex-col gap-2 p-3 border-b border-border/50 transition-colors ${!notif.read ? "bg-primary/5" : ""} ${!pendingReq ? "cursor-pointer hover:bg-muted/50" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-muted overflow-hidden flex-shrink-0 border border-border/50">
                            {notif.fromAvatar ? (
                              <img src={notif.fromAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {getNotifIcon(notif.type)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <p className={`text-sm leading-tight ${!notif.read ? "font-semibold" : ""}`}>{notif.title}</p>
                              {!notif.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.description}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase font-medium tracking-tight">
                                {notif.type.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] text-muted-foreground/60">• {timeAgo(notif.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {pendingReq && (
                          <div className="flex gap-2 ml-11 mt-1">
                            <Button
                              size="sm"
                              className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700"
                              onClick={(e) => { e.stopPropagation(); handleAccept(pendingReq._id); }}
                              disabled={loadingId === pendingReq._id}
                            >
                              <UserCheck className="w-3.5 h-3.5 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-7 text-xs text-red-500 border-red-300 hover:bg-red-50"
                              onClick={(e) => { e.stopPropagation(); handleDecline(pendingReq._id); }}
                              disabled={loadingId === pendingReq._id}
                            >
                              <UserX className="w-3.5 h-3.5 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
