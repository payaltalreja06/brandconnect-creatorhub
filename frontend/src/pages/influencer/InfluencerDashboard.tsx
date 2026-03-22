import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Eye, Video, TrendingUp, IndianRupee, Target, ArrowUpRight, ArrowDownRight, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { analyticsApi, campaignApi } from "@/lib/api";
import * as dummy from "@/data/dummy";

const COLORS = ["hsl(12, 80%, 62%)", "hsl(222, 62%, 18%)", "hsl(173, 58%, 39%)", "hsl(43, 96%, 56%)", "hsl(262, 52%, 55%)"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function InfluencerDashboard() {
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
      } catch {
        // Fallback to dummy
        setAnalytics(null);
        setCampaigns(dummy.campaigns);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = analytics || {
    ytOverview: { totalViews: 12500000, subscribers: 2400000 },
    ytMonthlyViews: dummy.ytAnalytics.monthlyViews,
    ytDemographics: dummy.ytAnalytics.demographics,
    ytGenderSplit: dummy.ytAnalytics.genderSplit,
    instaOverview: { followers: 600000 },
    instaEngagementByType: dummy.instaAnalytics.engagementByType,
    totalEarnings: "₹8.45L",
    monthlyEarnings: dummy.revenueData.monthlyEarnings,
    platformComparison: dummy.platformComparison,
    postingBestTimes: dummy.postingData.bestPostingTimes,
    postingBestDays: dummy.postingData.bestDays,
    healthScore: 87,
  };

  const kpiCards = [
    { label: "Total Followers", value: data.ytOverview.subscribers >= 1000000 ? (data.ytOverview.subscribers / 1000000).toFixed(1) + "M" : (data.ytOverview.subscribers / 1000).toFixed(0) + "K", change: "+12.5%", up: true, icon: Users },
    { label: "Total Views", value: data.ytOverview.totalViews >= 1000000 ? (data.ytOverview.totalViews / 1000000).toFixed(1) + "M" : (data.ytOverview.totalViews / 1000).toFixed(0) + "K", change: "+8.3%", up: true, icon: Eye },
    { label: "Avg Engagement", value: "4.8%", change: "+0.6%", up: true, icon: TrendingUp },
    { label: "Total Revenue", value: data.totalEarnings, change: "+22%", up: true, icon: IndianRupee },
    { label: "Campaigns Done", value: campaigns.filter(c => c.status === "completed").length || "8", change: "+2", up: true, icon: Target },
    { label: "Health Score", value: `${data.healthScore}/100`, change: "+3", up: true, icon: Video },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Your performance overview at a glance</p>
        </div>
        <a href="/influencer/profile">
          <Button variant="outline" size="sm" className="gap-2">
            Edit Profile
          </Button>
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map((kpi, i) => (
          <motion.div key={kpi.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="w-4 h-4 text-muted-foreground" />
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
                    {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                </div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Audience Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.ytMonthlyViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => [`${(v/1000).toFixed(0)}K`, "Views"]} />
                <Line type="monotone" dataKey="views" stroke="hsl(12,80%,62%)" strokeWidth={2} dot={{ fill: "hsl(12,80%,62%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Earnings"]} />
                <Bar dataKey="earnings" fill="hsl(222,62%,18%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Audience Demographics</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data.ytDemographics} dataKey="percent" nameKey="age" cx="50%" cy="50%" outerRadius={70} label={({ age, percent }) => `${age}: ${percent}%`}>
                  {data.ytDemographics.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Gender Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4 pt-4">
              {data.ytGenderSplit?.map((g: any) => (
                <div key={g.gender}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{g.gender}</span>
                    <span className="font-medium">{g.percent}%</span>
                  </div>
                  <Progress value={g.percent} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Engagement by Content</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.instaEngagementByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 12 }} width={70} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Rate"]} />
                <Bar dataKey="rate" fill="hsl(173,58%,39%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Platform Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Platform</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Followers</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Engagement</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {data.platformComparison?.map((p: any) => (
                    <tr key={p.platform} className="border-b border-border/50">
                      <td className="py-2.5 font-medium">{p.platform}</td>
                      <td className="py-2.5 text-right">{p.followers >= 1000000 ? (p.followers / 1000000).toFixed(1) + "M" : (p.followers / 1000).toFixed(0) + "K"}</td>
                      <td className="py-2.5 text-right">{p.engagement}%</td>
                      <td className="py-2.5 text-right text-emerald-600">+{p.growth}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Campaigns</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCampaigns.slice(0, 3).map((c: any) => (
                <div key={c._id || c.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  {c.brandLogo && c.brandLogo.startsWith('http') ? (
                    <img src={c.brandLogo} alt={c.brandName} className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0" />
                  ) : (
                    <span className="text-2xl shrink-0">{c.brandLogo || "🏢"}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.brandName}</p>
                  </div>
                  <Badge variant={c.status === "in_progress" ? "default" : "secondary"} className="text-xs shrink-0 capitalize">
                    {c.status}
                  </Badge>
                </div>
              ))}
              {activeCampaigns.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No active campaigns</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Best Posting Times & Days</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.postingBestTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(vValue: number) => [`${vValue}%`, "Engagement"]} />
                <Bar dataKey="engagement" fill="hsl(43,96%,56%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.postingBestDays}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(vValue: number) => [`${vValue}%`, "Engagement"]} />
                <Bar dataKey="engagement" fill="hsl(262,52%,55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Influencer Health Score</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="hsl(220,13%,90%)" strokeWidth="10" fill="none" />
                <circle cx="60" cy="60" r="50" stroke="hsl(12,80%,62%)" strokeWidth="10" fill="none"
                  strokeDasharray={`${(data.healthScore || 0) * 3.14} ${100 * 3.14}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-3xl">
                {data.healthScore}
              </div>
            </div>
            <div className="space-y-2 text-sm flex-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Engagement</span><span className="font-medium">40% weight</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Growth</span><span className="font-medium">30% weight</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Audience Quality</span><span className="font-medium">20% weight</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Campaign Success</span><span className="font-medium">10% weight</span></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
