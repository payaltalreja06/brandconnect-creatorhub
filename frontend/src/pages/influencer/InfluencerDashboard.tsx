import { motion } from "framer-motion";
import {
  Users, Eye, Video, TrendingUp, IndianRupee, Target, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { ytAnalytics, instaAnalytics, revenueData, postingData, platformComparison, campaigns } from "@/data/dummy";

const kpiCards = [
  { label: "Total Followers", value: "2.4M", change: "+12.5%", up: true, icon: Users },
  { label: "Total Views", value: "12.5M", change: "+8.3%", up: true, icon: Eye },
  { label: "Avg Engagement", value: "4.8%", change: "+0.6%", up: true, icon: TrendingUp },
  { label: "Total Revenue", value: "₹8.45L", change: "+22%", up: true, icon: IndianRupee },
  { label: "Campaigns Done", value: "8", change: "+2", up: true, icon: Target },
  { label: "Health Score", value: "87/100", change: "+3", up: true, icon: Video },
];

const COLORS = ["hsl(12, 80%, 62%)", "hsl(222, 62%, 18%)", "hsl(173, 58%, 39%)", "hsl(43, 96%, 56%)", "hsl(262, 52%, 55%)"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function InfluencerDashboard() {
  const activeCampaigns = campaigns.filter(c => c.status === "in_progress" || c.status === "accepted");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Your performance overview at a glance</p>
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
        {/* Follower Growth */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Audience Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ytAnalytics.monthlyViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => [`${(v/1000).toFixed(0)}K`, "Views"]} />
                <Line type="monotone" dataKey="views" stroke="hsl(12,80%,62%)" strokeWidth={2} dot={{ fill: "hsl(12,80%,62%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData.monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Earnings"]} />
                <Bar dataKey="earnings" fill="hsl(222,62%,18%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Demographics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={ytAnalytics.demographics} dataKey="percent" nameKey="age" cx="50%" cy="50%" outerRadius={70} label={({ age, percent }) => `${age}: ${percent}%`}>
                  {ytAnalytics.demographics.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Split */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-4">
              {ytAnalytics.genderSplit.map((g, i) => (
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

        {/* Engagement by Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement by Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={instaAnalytics.engagementByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" width={70} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Rate"]} />
                <Bar dataKey="rate" fill="hsl(173,58%,39%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Comparison + Active Campaigns */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Comparison</CardTitle>
          </CardHeader>
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
                  {platformComparison.map((p) => (
                    <tr key={p.platform} className="border-b border-border/50">
                      <td className="py-2.5 font-medium">{p.platform}</td>
                      <td className="py-2.5 text-right">{(p.followers / 1000000).toFixed(1)}M</td>
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
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCampaigns.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <span className="text-2xl">{c.brandLogo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.brandName}</p>
                  </div>
                  <Badge variant={c.status === "in_progress" ? "default" : "secondary"} className="text-xs shrink-0">
                    {c.status === "in_progress" ? "Active" : "Accepted"}
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

      {/* Best Posting Times */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Best Posting Times & Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={postingData.bestPostingTimes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(215,16%,47%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(215,16%,47%)" />
                <Tooltip formatter={(v: number) => [`${v}%`, "Engagement"]} />
                <Bar dataKey="engagement" fill="hsl(43,96%,56%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={postingData.bestDays}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(215,16%,47%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(215,16%,47%)" />
                <Tooltip formatter={(v: number) => [`${v}%`, "Engagement"]} />
                <Bar dataKey="engagement" fill="hsl(262,52%,55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Health Score */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Influencer Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="hsl(220,13%,90%)" strokeWidth="10" fill="none" />
                <circle cx="60" cy="60" r="50" stroke="hsl(12,80%,62%)" strokeWidth="10" fill="none"
                  strokeDasharray={`${87 * 3.14} ${100 * 3.14}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">87</span>
              </div>
            </div>
            <div className="space-y-2 text-sm flex-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Engagement</span><span className="font-medium">40% weight — 92/100</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Growth</span><span className="font-medium">30% weight — 85/100</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Audience Quality</span><span className="font-medium">20% weight — 78/100</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Campaign Success</span><span className="font-medium">10% weight — 90/100</span></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
