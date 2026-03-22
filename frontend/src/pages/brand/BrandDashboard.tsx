import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Megaphone, TrendingUp, IndianRupee, Users, Target, ArrowUpRight, Play, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { analyticsApi, campaignApi } from "@/lib/api";
import * as dummy from "@/data/dummy";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function BrandDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [anaRes, camRes] = await Promise.all([
          analyticsApi.getMe(),
          campaignApi.getAll(),
        ]);
        setAnalytics(anaRes.data);
        setCampaigns(camRes.data);
      } catch (err) {
        // Fallback to dummy
        setAnalytics(null);
        setCampaigns(dummy.campaigns);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = analytics?.brandOverview || {
    totalCampaigns: 12,
    activeCampaigns: 3,
    successRate: 92,
    totalSpending: "₹15.6L",
    avgCampaignROI: 4.2,
  };

  const spendingTrend = analytics?.brandSpendingTrend || dummy.brandAnalytics.spendingTrend;
  const performance = analytics?.brandCampaignPerformance || dummy.brandAnalytics.campaignPerformance;
  const topInfluencers = analytics?.brandInfluencerComparison || dummy.brandAnalytics.influencerComparison;

  const kpiCards = [
    { label: "Total Campaigns", value: data.totalCampaigns.toString(), change: "+3", icon: Megaphone },
    { label: "Active Campaigns", value: data.activeCampaigns.toString(), change: "+1", icon: Play },
    { label: "Success Rate", value: `${data.successRate}%`, change: "+4%", icon: Target },
    { label: "Total Spending", value: data.totalSpending, change: "+18%", icon: IndianRupee },
    { label: "Avg ROI", value: `${data.avgCampaignROI}x`, change: "+0.5", icon: TrendingUp },
    { label: "Influencers", value: topInfluencers.length.toString(), change: "+2", icon: Users },
  ];

  const activeCampaigns = campaigns.filter(c => c.status === "in_progress" || c.status === "accepted" || c.status === "pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Brand Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your marketing campaigns and performance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map((kpi, i) => (
          <motion.div key={kpi.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />{kpi.change}
                  </span>
                </div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Spending Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={spendingTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(vValue: number) => [`₹${vValue.toLocaleString()}`, "Spending"]} />
                <Bar dataKey="spending" fill="hsl(222,62%,18%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Campaign Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Campaign</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Engagement</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">ROI</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Reach</th>
                  </tr>
                </thead>
                <tbody>
                  {performance?.map((c: any) => (
                    <tr key={c.campaign} className="border-b border-border/50">
                      <td className="py-2.5 font-medium">{c.campaign}</td>
                      <td className="py-2.5 text-right">{c.engagement}%</td>
                      <td className="py-2.5 text-right">{c.roi}x</td>
                      <td className="py-2.5 text-right">{(c.reach/1000000).toFixed(1)}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Campaigns</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCampaigns.map((c: any) => (
                <div key={c._id || c.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  {c.brandLogo && c.brandLogo.startsWith('http') ? (
                    <img src={c.brandLogo} alt={c.brandName} className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0" />
                  ) : (
                    <span className="text-2xl shrink-0">{c.brandLogo || "🏢"}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.influencerName || "Unassigned"}</p>
                  </div>
                  <Badge variant="default" className="text-xs capitalize">{c.status}</Badge>
                </div>
              ))}
              {activeCampaigns.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No active campaigns</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top Influencers by ROI</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topInfluencers?.map((inf: any, i: number) => (
                <div key={inf.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{inf.name}</p>
                    <p className="text-xs text-muted-foreground">{inf.campaigns} campaigns</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{inf.roi}x ROI</p>
                    <p className="text-xs text-muted-foreground">{inf.engagement}% eng.</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
