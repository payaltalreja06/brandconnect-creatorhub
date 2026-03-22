import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CheckCircle, Clock, Play, AlertCircle, Loader2 } from "lucide-react";
import { campaignApi } from "@/lib/api";
import { toast } from "sonner";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
  accepted: { label: "Accepted", icon: AlertCircle, variant: "outline" as const },
  in_progress: { label: "In Progress", icon: Play, variant: "default" as const },
  completed: { label: "Completed", icon: CheckCircle, variant: "secondary" as const },
};

export default function BrandCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // New campaign state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newDeliverables, setNewDeliverables] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await campaignApi.getAll();
      setCampaigns(res.data || []);
    } catch {
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setCreateLoading(true);
    try {
      await campaignApi.create({
        title: newTitle,
        description: newDesc,
        budget: newBudget,
        deadline: newDeadline,
        deliverables: newDeliverables.split(",").map(d => d.trim())
      });
      toast.success("Campaign created successfully!");
      setOpen(false);
      setNewTitle(""); setNewDesc(""); setNewBudget(""); setNewDeadline(""); setNewDeliverables("");
      fetchCampaigns();
    } catch {
      toast.error("Failed to create campaign");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await campaignApi.updateStatus(id, status);
      toast.success(`Status updated to ${status}`);
      fetchCampaigns();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground text-sm">Create and manage your influencer campaigns</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> New Campaign</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Campaign</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Title *</label>
                  <Input placeholder="e.g., Summer Product Launch" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Describe campaign goals and requirements..." rows={3} value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget</label>
                    <Input placeholder="e.g., ₹1,00,000" value={newBudget} onChange={e => setNewBudget(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deadline</label>
                    <Input type="date" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deliverables (comma separated)</label>
                  <Input placeholder="e.g., 1 YouTube video, 2 Reels" value={newDeliverables} onChange={e => setNewDeliverables(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={createLoading}>
                  {createLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Create Campaign
                </Button>
              </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: campaigns.length },
          { label: "Active", value: campaigns.filter(c => c.status === "in_progress").length },
          { label: "Pending", value: campaigns.filter(c => c.status === "pending").length },
          { label: "Completed", value: campaigns.filter(c => c.status === "completed").length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {["all", "active", "pending", "completed"].map((filter) => (
          <TabsContent key={filter} value={filter} className="space-y-3 mt-4">
            {campaigns
              .filter(c => filter === "all" || (filter === "active" && c.status === "in_progress") || c.status === filter)
              .map((c) => {
                const config = statusConfig[c.status];
                return (
                  <Card key={c.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border/50 shadow-sm">
                          {c.brandLogo?.startsWith("http") ? (
                            <img src={c.brandLogo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">{c.brandLogo || "💼"}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{c.title}</h3>
                            <Badge variant={config.variant} className="text-xs gap-1">
                              <config.icon className="w-3 h-3" /> {config.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{c.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                            <span>Budget: <span className="font-medium text-foreground">{c.budget}</span></span>
                            <span>Deadline: <span className="font-medium text-foreground">{c.deadline}</span></span>
                            {c.influencerName && <span>Influencer: <span className="font-medium text-foreground">{c.influencerName}</span></span>}
                            {c.roi && <span>ROI: <span className="font-medium text-foreground">{c.roi}x</span></span>}
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Manage</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Manage: {c.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-2">
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Status</h4>
                                <Badge variant={config.variant} className="gap-1 mt-1">
                                  <config.icon className="w-3 h-3" /> {config.label}
                                </Badge>
                              </div>
                              {c.influencerName && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-1">Influencer</h4>
                                  <p className="text-sm text-muted-foreground">{c.influencerName}</p>
                                </div>
                              )}
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Description</h4>
                                <p className="text-sm text-muted-foreground">{c.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-sm mb-1">Budget</h4>
                                  <p className="text-sm text-foreground font-medium">{c.budget}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm mb-1">Deadline</h4>
                                  <p className="text-sm text-foreground font-medium">{c.deadline}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button className="w-full flex-1" variant="outline" onClick={() => handleStatusUpdate(c._id, "in_progress")} disabled={c.status === "in_progress"}>
                                  Start Campaign
                                </Button>
                                {c.status !== "completed" && (
                                  <Button className="w-full flex-1" onClick={() => handleStatusUpdate(c._id, "completed")}>
                                    Mark Completed
                                  </Button>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
