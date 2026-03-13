import { motion } from "framer-motion";
import {
  Megaphone, TrendingUp, IndianRupee, Users, Target, ArrowUpRight, CheckCircle, Clock, Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { brandAnalytics, campaigns } from "@/data/dummy";

const kpiCards = [
  { label: "Total Campaigns", value: "12", change: "+3", icon: Megaphone },
  { label: "Active Campaigns", value: "3", change: "+1", icon: Play },
  { label: "Success Rate", value: "92%", change: "+4%", icon: Target },
  { label: "Total Spending", value: "₹15.6L", change: "+18%", icon: IndianRupee },
  { label: "Avg ROI", value: "4.2x", change: "+0.5", icon: TrendingUp },
  { label: "Influencers", value: "6", change: "+2", icon: Users },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function BrandDashboard() {
  const activeCampaigns = campaigns.filter(c => c.status === "in_progress" || c.status === "accepted");

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
              <BarChart data={brandAnalytics.spendingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Spending"]} />
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
                  {brandAnalytics.campaignPerformance.map((c) => (
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
              {activeCampaigns.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <span className="text-2xl">{c.brandLogo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.influencerName || "Unassigned"}</p>
                  </div>
                  <Badge variant="default" className="text-xs">{c.status === "in_progress" ? "Active" : "Accepted"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top Influencers by ROI</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {brandAnalytics.influencerComparison.map((inf, i) => (
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
