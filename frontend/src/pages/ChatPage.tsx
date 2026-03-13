import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { chatThreads, type ChatThread, type ChatMessage } from "@/data/dummy";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [threads] = useState(chatThreads);
  const [activeThread, setActiveThread] = useState<ChatThread>(threads[0]);
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, ChatMessage[]>>({});

  const getMessages = (thread: ChatThread) => localMessages[thread.id] || thread.messages;

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: "u1",
      senderName: "You",
      senderAvatar: "",
      text: message,
      timestamp: "Just now",
      isOwn: true,
    };
    setLocalMessages((prev) => ({
      ...prev,
      [activeThread.id]: [...getMessages(activeThread), newMsg],
    }));
    setMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-1">Messages</h1>
        <p className="text-muted-foreground mb-6">Chat with brands and influencers</p>
      </motion.div>

      <div className="flex border border-border rounded-xl overflow-hidden bg-card" style={{ height: "calc(100vh - 220px)" }}>
        {/* Thread List */}
        <div className="w-80 border-r border-border flex flex-col shrink-0 hidden md:flex">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10 h-9" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThread(t)}
                className={cn(
                  "w-full p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left",
                  activeThread.id === t.id && "bg-muted"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg shrink-0">
                  {t.avatar.startsWith("http") ? (
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    t.avatar
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">{t.name}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{t.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{t.lastMessage}</p>
                </div>
                {t.unread > 0 && (
                  <Badge className="bg-accent text-accent-foreground text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {t.unread}
                  </Badge>
                )}
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg">
              {activeThread.avatar.startsWith("http") ? (
                <img src={activeThread.avatar} alt={activeThread.name} className="w-9 h-9 rounded-full" />
              ) : (
                activeThread.avatar
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{activeThread.name}</p>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {getMessages(activeThread).map((msg) => (
                <div key={msg.id} className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5",
                    msg.isOwn
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  )}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={cn("text-xs mt-1", msg.isOwn ? "text-primary-foreground/60" : "text-muted-foreground")}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
