import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft } from "lucide-react";
import { chatThreads, ChatThread } from "@/data/dummy";

export default function InfluencerMessages() {
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const [threads, setThreads] = useState(chatThreads);

  const handleSend = () => {
    if (!newMsg.trim() || !selectedThread) return;
    const updated = threads.map(t =>
      t.id === selectedThread.id
        ? {
            ...t,
            lastMessage: newMsg,
            messages: [...t.messages, {
              id: `m${Date.now()}`, senderId: "u1", senderName: "You", senderAvatar: "",
              text: newMsg, timestamp: "Now", isOwn: true,
            }],
          }
        : t
    );
    setThreads(updated);
    setSelectedThread(updated.find(t => t.id === selectedThread.id)!);
    setNewMsg("");
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      {/* Thread List */}
      <div className={`w-full md:w-80 border-r border-border flex flex-col ${selectedThread ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-lg">Messages</h2>
        </div>
        <div className="flex-1 overflow-auto">
          {threads.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedThread(t)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 border-b border-border/50 ${selectedThread?.id === t.id ? "bg-muted/50" : ""}`}
            >
              {t.avatar.startsWith("http") ? (
                <img src={t.avatar} className="w-10 h-10 rounded-full bg-muted" alt="" />
              ) : (
                <span className="text-2xl w-10 h-10 flex items-center justify-center">{t.avatar}</span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{t.lastMessage}</p>
              </div>
              {t.unread > 0 && (
                <Badge variant="destructive" className="text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                  {t.unread}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedThread ? "hidden md:flex" : "flex"}`}>
        {selectedThread ? (
          <>
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedThread(null)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium">{selectedThread.name}</span>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {selectedThread.messages.map((m) => (
                <div key={m.id} className={`flex ${m.isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${m.isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {m.text}
                    <p className={`text-xs mt-1 ${m.isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{m.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <Input placeholder="Type a message..." value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} />
              <Button size="icon" onClick={handleSend}><Send className="w-4 h-4" /></Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
