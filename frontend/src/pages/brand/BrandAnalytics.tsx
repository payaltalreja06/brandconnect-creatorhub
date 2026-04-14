import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { influencerApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function BrandAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalReach: 0,
    engagement: 0,
    conversionRate: 0,
    activeCampaigns: 0,
    reachHistory: [],
    campaignPerformance: [],
    spendingTrend: [],
    influencerComparison: []
  });

  useEffect(() => {
    // In a real app, we'd have a specific brand analytics endpoint
    // For now, we'll simulate loading to keep the UI stable
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const brandAnalytics = data;
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Campaign Analytics</h1>
        <p className="text-muted-foreground text-sm">Measure campaign performance and influencer ROI</p>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Spending Trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
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

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Campaign Performance</CardTitle></CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Influencer Comparison</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={brandAnalytics.influencerComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(215,16%,47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <Tooltip />
                <Bar dataKey="engagement" fill="hsl(12,80%,62%)" name="Engagement %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="roi" fill="hsl(173,58%,39%)" name="ROI" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
