import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { campaignApi } from "@/lib/api";
import { type Campaign } from "@/types";
import { CheckCircle, Clock, Play, AlertCircle, Loader2 } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
  accepted: { label: "Accepted", icon: AlertCircle, variant: "outline" as const },
  in_progress: { label: "In Progress", icon: Play, variant: "default" as const },
  completed: { label: "Completed", icon: CheckCircle, variant: "secondary" as const },
};

export default function InfluencerCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const res = await campaignApi.getAll();
        setCampaigns(res.data || []);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const myCampaigns = campaigns;

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <p className="text-muted-foreground text-sm">Track and manage your brand collaborations</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: myCampaigns.length },
          { label: "Active", value: myCampaigns.filter(c => c.status === "in_progress").length },
          { label: "Completed", value: myCampaigns.filter(c => c.status === "completed").length },
          { label: "Success Rate", value: `${Math.round((myCampaigns.filter(c => c.status === "completed").length / Math.max(myCampaigns.length, 1)) * 100)}%` },
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
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {["all", "active", "completed"].map((filter) => (
          <TabsContent key={filter} value={filter} className="space-y-3 mt-4">
            {myCampaigns
              .filter(c => filter === "all" || (filter === "active" && (c.status === "in_progress" || c.status === "accepted")) || (filter === "completed" && c.status === "completed"))
              .map((c) => {
                const config = statusConfig[c.status];
                return (
                  <Card key={c.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{c.brandLogo}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{c.title}</h3>
                            <Badge variant={config.variant} className="text-xs gap-1">
                              <config.icon className="w-3 h-3" /> {config.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{c.brandName}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{c.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span>Budget: <span className="font-medium text-foreground">{c.budget}</span></span>
                            <span>Deadline: <span className="font-medium text-foreground">{c.deadline}</span></span>
                            <span>Deliverables: <span className="font-medium text-foreground">{c.deliverables.length}</span></span>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View Details</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{c.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-2">
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Brand</h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-2"><span className="text-xl">{c.brandLogo}</span> {c.brandName}</p>
                              </div>
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
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Deliverables</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                  {c.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
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
