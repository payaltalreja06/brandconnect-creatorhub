import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, ArrowLeft, Check, CheckCheck, Eye, Loader2,
  Rocket, CreditCard, MoreVertical, Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { messageApi } from "@/lib/api";
import { getSocket, joinThread, leaveThread } from "@/lib/socket";
import { useAuth } from "@/contexts/AuthContext";
import { useChatCount } from "@/contexts/ChatContext";
import { toast } from "sonner";

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  type: "text" | "campaign_start" | "payment_init" | "system";
  metadata?: Record<string, unknown>;
  status: "sent" | "delivered" | "seen";
  seenAt?: string;
  createdAt: string;
}

interface Thread {
  _id: string;
  participants: string[];
  participantNames: string[];
  participantAvatars: string[];
  campaignName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: Record<string, number>;
}

function MessageStatusIcon({ status, isOwn }: { status: string; isOwn: boolean }) {
  if (!isOwn) return null;
  if (status === "seen") return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />;
  if (status === "delivered") return <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/60" />;
  return <Check className="w-3.5 h-3.5 text-primary-foreground/40" />;
}

function SpecialMessage({ msg, isOwn }: { msg: Message; isOwn: boolean }) {
  if (msg.type === "campaign_start") {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[80%] rounded-2xl border-2 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Campaign Started!</span>
          </div>
          <p className="text-sm font-medium">{(msg.metadata as { campaignName?: string })?.campaignName || "Campaign"}</p>
          <p className="text-xs text-muted-foreground mt-1">Budget: {(msg.metadata as { budget?: string })?.budget || "TBD"}</p>
          <p className="text-xs text-muted-foreground">Timeline: {(msg.metadata as { timeline?: string })?.timeline || "TBD"}</p>
          <p className="text-xs text-muted-foreground mt-2">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    );
  }
  if (msg.type === "payment_init") {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[80%] rounded-2xl border-2 border-blue-500/30 bg-blue-50 dark:bg-blue-950/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-700 dark:text-blue-400">Payment Initiated</span>
          </div>
          <p className="text-sm font-medium">Amount: {(msg.metadata as { amount?: string })?.amount || "TBD"}</p>
          <p className="text-xs text-muted-foreground mt-1">Method: {(msg.metadata as { method?: string })?.method || "Bank Transfer"}</p>
          <Badge variant="secondary" className="mt-2 text-xs">
            {(msg.metadata as { status?: string })?.status || "Pending"}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    );
  }
  return null;
}

function CampaignStartDialog({ threadId, onSent }: { threadId: string; onSent: () => void }) {
  const [open, setOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!campaignName) { toast.error("Campaign name required"); return; }
    setLoading(true);
    try {
      await messageApi.sendMessage(threadId, {
        text: `🚀 Campaign Started: ${campaignName}`,
        type: "campaign_start",
        metadata: { campaignName, budget, timeline },
      });
      toast.success("Campaign started!");
      setOpen(false);
      onSent();
    } catch {
      toast.error("Failed to start campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50">
          <Rocket className="w-3.5 h-3.5" /> Start Campaign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Start Campaign</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Campaign Name *</label>
            <Input placeholder="e.g. Summer Product Launch" value={campaignName} onChange={e => setCampaignName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Budget</label>
            <Input placeholder="e.g. ₹1,20,000" value={budget} onChange={e => setBudget(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Timeline</label>
            <Input placeholder="e.g. 30 days from now" value={timeline} onChange={e => setTimeline(e.target.value)} />
          </div>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleSend} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Launch Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PaymentDialog({ threadId, onSent }: { threadId: string; onSent: () => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!amount) { toast.error("Amount required"); return; }
    setLoading(true);
    try {
      await messageApi.sendMessage(threadId, {
        text: `💳 Payment Initiated: ${amount}`,
        type: "payment_init",
        metadata: { amount, method, note, status: "Processing" },
      });
      toast.success("Payment initiated!");
      setOpen(false);
      onSent();
    } catch {
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs border-blue-300 text-blue-700 hover:bg-blue-50">
          <CreditCard className="w-3.5 h-3.5" /> Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Initialize Payment</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Amount *</label>
            <Input placeholder="e.g. ₹1,20,000" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Payment Method</label>
            <select className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm" value={method} onChange={e => setMethod(e.target.value)}>
              <option>Bank Transfer</option>
              <option>UPI</option>
              <option>PayPal</option>
              <option>Escrow</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Note (optional)</label>
            <Input placeholder="Payment for campaign deliverables..." value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSend} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Initialize Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ChatInterface() {
  const { user } = useAuth();
  const { markAllSeen: globalMarkSeen } = useChatCount();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchThreads = useCallback(async () => {
    try {
      setLoadingThreads(true);
      const res = await messageApi.getThreads();
      setThreads(res.data || []);
    } catch {
      // silent
    } finally {
      setLoadingThreads(false);
    }
  }, []);

  useEffect(() => { fetchThreads(); }, [fetchThreads]);

  // Socket listeners
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();

    socket.on("new_message", (msg: Message) => {
      setMessages(prev => {
        const exists = prev.some(m => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
      // Auto-scroll on new message
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    socket.on("message_status_update", (data: { messageId: string; status: string }) => {
      setMessages(prev => prev.map(m => m._id === data.messageId ? { ...m, status: data.status as Message["status"] } : m));
    });

    socket.on("all_seen", (data: { seenBy: string }) => {
      setMessages(prev => prev.map(m => ({
        ...m,
        status: m.senderId !== data.seenBy ? "seen" : m.status,
      } as Message)));
    });

    socket.on("typing", (data: { userId: string }) => {
      if (data.userId !== user.id) setIsTyping(true);
    });

    socket.on("stop_typing", (data: { userId: string }) => {
      if (data.userId !== user.id) setIsTyping(false);
    });

    socket.on("chat_unlocked", () => {
      fetchThreads();
    });

    return () => {
      socket.off("new_message");
      socket.off("message_status_update");
      socket.off("all_seen");
      socket.off("typing");
      socket.off("stop_typing");
      socket.off("chat_unlocked");
    };
  }, [user, fetchThreads]);

  const selectThread = useCallback(async (thread: Thread) => {
    if (selectedThread?._id) leaveThread(selectedThread._id);
    setSelectedThread(thread);
    setLoadingMessages(true);
    try {
      joinThread(thread._id);
      const res = await messageApi.getMessages(thread._id);
      setMessages(res.data || []);
      // Mark all as seen
      await globalMarkSeen(thread._id);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      // silent
    } finally {
      setLoadingMessages(false);
    }
    // Update unread in threads list
    setThreads(prev => prev.map(t => t._id === thread._id ? { ...t, unreadCount: { ...t.unreadCount, [user!.id]: 0 } } : t));
  }, [selectedThread, user]);

  const handleSend = async () => {
    if (!newMsg.trim() || !selectedThread || sending) return;
    const text = newMsg.trim();
    setNewMsg("");
    setSending(true);
    // Optimistic add
    const optimistic: Message = {
      _id: `opt-${Date.now()}`,
      senderId: user!.id,
      senderName: user!.name,
      senderAvatar: user!.avatar || "",
      text,
      type: "text",
      status: "sent",
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    try {
      const res = await messageApi.sendMessage(selectedThread._id, { text });
      // To prevent duplicates, check if socket already added it
      setMessages(prev => {
        const alreadyIn = prev.some(m => m._id === res.data._id);
        if (alreadyIn) {
          // Socket already added it, just remove optimistic one
          return prev.filter(m => m._id !== optimistic._id);
        }
        // Replace optimistic with real
        return prev.map(m => m._id === optimistic._id ? res.data : m);
      });
    } catch {
      setMessages(prev => prev.filter(m => m._id !== optimistic._id));
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    if (!selectedThread) return;
    const socket = getSocket();
    socket.emit("typing", { threadId: selectedThread._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { threadId: selectedThread._id });
    }, 1500);
  };

  const onMsgRefresh = useCallback(async () => {
    if (!selectedThread) return;
    const res = await messageApi.getMessages(selectedThread._id);
    setMessages(res.data || []);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [selectedThread]);

  const getOtherParticipant = (thread: Thread) => {
    const idx = thread.participants.findIndex(p => p !== user?.id);
    return {
      name: thread.participantNames[idx] || "Unknown",
      avatar: thread.participantAvatars[idx] || "",
    };
  };

  const getUnread = (thread: Thread) => thread.unreadCount?.[user?.id || ""] || 0;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      {/* Thread List */}
      <div className={`w-full md:w-80 border-r border-border flex flex-col ${selectedThread ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-lg">Messages</h2>
          <p className="text-xs text-muted-foreground">Your collaborations</p>
        </div>
        <div className="flex-1 overflow-auto">
          {loadingThreads ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : threads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <p className="mb-1">No conversations yet.</p>
              <p>Accept a collaboration request to start chatting!</p>
            </div>
          ) : (
            threads.map((t) => {
              const other = getOtherParticipant(t);
              const unread = getUnread(t);
              return (
                <div
                  key={t._id}
                  onClick={() => selectThread(t)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 border-b border-border/50 transition-colors ${selectedThread?._id === t._id ? "bg-muted/70" : ""}`}
                >
                  <div className="relative shrink-0">
                    {other.avatar?.startsWith("http") ? (
                      <img src={other.avatar} className="w-10 h-10 rounded-full bg-muted object-cover" alt="" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">{other.avatar}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{other.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0 ml-1">
                        {t.lastMessageAt ? new Date(t.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.lastMessage || "Chat unlocked"}</p>
                    {t.campaignName && <p className="text-xs text-primary/70 truncate">📋 {t.campaignName}</p>}
                  </div>
                  {unread > 0 && (
                    <Badge variant="destructive" className="text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full shrink-0">
                      {unread}
                    </Badge>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${!selectedThread ? "hidden md:flex" : "flex"}`}>
        {selectedThread ? (
          <>
            {/* Chat header */}
            <div className="p-3 border-b border-border flex items-center gap-3 bg-card/50 backdrop-blur-sm">
              <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => setSelectedThread(null)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              {(() => {
                const other = getOtherParticipant(selectedThread);
                return (
                  <>
                    {other.avatar?.startsWith("http") ? (
                      <img src={other.avatar} className="w-9 h-9 rounded-full bg-muted object-cover" alt="" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-lg">{other.avatar}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{other.name}</p>
                      {selectedThread.campaignName && (
                        <p className="text-xs text-muted-foreground truncate">📋 {selectedThread.campaignName}</p>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-auto p-4 space-y-2 bg-muted/20">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  Say hello! 👋
                </div>
              ) : (
                messages.map((m) => {
                  const isOwn = m.senderId === user?.id;
                  if (m.type === "campaign_start" || m.type === "payment_init") {
                    return <SpecialMessage key={m._id} msg={m} isOwn={isOwn} />;
                  }
                  return (
                    <motion.div
                      key={m._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${isOwn ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
                        {m.text}
                        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          <span className="text-[10px]">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <MessageStatusIcon status={m.status} isOwn={isOwn} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-2.5">
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map(i => (
                          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-3 border-t border-border bg-card/50 backdrop-blur-sm">
              {user?.role === "brand" && (
                <div className="flex gap-2 mb-2">
                  <CampaignStartDialog threadId={selectedThread._id} onSent={onMsgRefresh} />
                  <PaymentDialog threadId={selectedThread._id} onSent={onMsgRefresh} />
                </div>
              )}
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Type a message..."
                  value={newMsg}
                  onChange={(e) => {
                    setNewMsg(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  className="flex-1 rounded-full"
                  disabled={sending}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!newMsg.trim() || sending}
                  className="rounded-full shrink-0"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Send className="w-7 h-7 opacity-30" />
            </div>
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
