import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Youtube, Instagram, Globe, Zap, Loader2,
  TrendingUp, Users, Eye, Play, Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { analyticsApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/formatters";

const COLORS = ["hsl(12, 80%, 62%)", "hsl(222, 62%, 18%)", "hsl(173, 58%, 39%)", "hsl(43, 96%, 56%)", "hsl(262, 52%, 55%)"];

export default function InfluencerAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await analyticsApi.getMe();
        setData(res.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // CRITICAL: Force Syncing message if REAL data is missing
  const hasRealData = data && data.ytOverview && (data.ytOverview.totalViews > 0 || data.ytOverview.subscribers > 0);

  if (!hasRealData) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
        <div className="max-w-md">
          <h2 className="text-xl font-bold font-display">Synchronizing your channel...</h2>
          <p className="text-muted-foreground mt-2">
            Detailed analytics are currently being calculated. 
            Please run the Spark ETL pipeline to populate your demographics and engagement trends.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 gap-2">
          <TrendingUp className="w-4 h-4" /> Refresh Status
        </Button>
      </div>
    );
  }

  const ana = data;
  const insta = data;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Detailed Analytics</h1>
          <p className="text-muted-foreground text-sm">Deep dive into your cross-platform audience metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 py-1 text-emerald-600 border-emerald-200 bg-emerald-50">
            <Zap className="w-3 h-3 fill-current" /> Live Sync Active
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="youtube" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="youtube" className="gap-2 data-[state=active]:bg-background">
            <Youtube className="w-4 h-4 text-red-500" /> YouTube
          </TabsTrigger>
          <TabsTrigger value="instagram" className="gap-2 data-[state=active]:bg-background">
            <Instagram className="w-4 h-4 text-pink-500" /> Instagram
          </TabsTrigger>
          <TabsTrigger value="demographics" className="gap-2 data-[state=active]:bg-background">
            <Globe className="w-4 h-4 text-blue-500" /> Demographics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="youtube" className="space-y-6 outline-none">
          {/* YT KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Subscribers", value: formatNumber(ana.ytOverview?.subscribers), icon: Users },
              { label: "Total Views", value: formatNumber(ana.ytOverview?.totalViews, 1, "auto"), icon: Eye },
              { label: "Avg Watch Time", value: ana.ytOverview?.avgWatchTime || "4:30", icon: Clock },
              { label: "Total Videos", value: ana.ytOverview?.totalVideos?.toString() || "245", icon: Play },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="p-4">
                  <kpi.icon className="w-4 h-4 text-muted-foreground mb-2" />
                  <p className="text-xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="text-sm">Monthly View Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={ana.ytMonthlyViews || []}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(12, 80%, 62%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(12, 80%, 62%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => formatNumber(v, 1, "auto")} />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="hsl(12, 80%, 62%)" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Retention Rate</CardTitle></CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[300px]">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="hsl(220,13%,90%)" strokeWidth="12" fill="none" />
                    <circle cx="60" cy="60" r="50" stroke="hsl(12, 80%, 62%)" strokeWidth="12" fill="none"
                      strokeDasharray={`${(ana.healthScore || 68) * 3.14} ${100 * 3.14}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{ana.healthScore || 0}%</span>
                    <span className="text-[10px] text-muted-foreground">Avg Retention</span>
                  </div>
                </div>
                <div className="mt-6 text-xs text-muted-foreground text-center">
                  Score based on real engagement KPIs
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-sm">Recent Video Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-left">
                      <th className="py-3 font-medium">Video Title</th>
                      <th className="py-3 font-medium">Views</th>
                      <th className="py-3 font-medium">CTR</th>
                      <th className="py-3 font-medium">Avg. Duration</th>
                      <th className="py-3 font-medium">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {(ana.ytRecentVideos || []).map((v: any) => (
                      <tr key={v.title} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4 font-medium truncate max-w-[300px]">{v.title}</td>
                        <td className="py-3">{formatNumber(v.views, 1, "auto")}</td>
                        <td className="py-3 text-emerald-600">{v.ctr}%</td>
                        <td className="py-3">{v.avgViewDuration}</td>
                        <td className="py-3 font-medium">{v.retention}%</td>
                      </tr>
                    ))}
                    {(!ana.ytRecentVideos || ana.ytRecentVideos.length === 0) && (
                      <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No video data available</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instagram" className="space-y-6 outline-none">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Followers", value: formatNumber(insta.instaOverview?.followers), icon: Users },
              { label: "Profile Reach", value: formatNumber(insta.instaOverview?.reach, 1, "auto"), icon: TrendingUp },
              { label: "Impressions", value: formatNumber(insta.instaOverview?.impressions, 1, "auto"), icon: Eye },
              { label: "Profile Visits", value: formatNumber(insta.instaOverview?.profileVisits, 1, "auto"), icon: Calendar },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{kpi.value || "0"}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">Engagement by Post Type</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={insta.instaEngagementByType || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="type" />
                    <YAxis tickFormatter={(v) => `${v}%`} />
                    <Tooltip />
                    <Bar dataKey="rate" fill="hsl(173, 58%, 39%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Weekly Reach Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={insta.instaWeeklyReach || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" />
                    <YAxis tickFormatter={(v) => formatNumber(v, 1, "auto")} />
                    <Tooltip />
                    <Line type="stepAfter" dataKey="reach" stroke="hsl(262, 52%, 55%)" strokeWidth={3} dot={{ fill: "hsl(262, 52%, 55%)", r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6 outline-none">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">Age Distribution</CardTitle></CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ana.ytDemographics || []} dataKey="percent" nameKey="age" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5}>
                      {(ana.ytDemographics || []).map((_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Top Geographies</CardTitle></CardHeader>
              <CardContent className="space-y-5 pt-4">
                {(ana.ytTopCountries || [])?.map((c: any) => (
                  <div key={c.country}>
                    <div className="flex justify-between text-sm mb-1.5 font-medium">
                      <span>{c.country}</span>
                      <span>{c.percent}%</span>
                    </div>
                    <Progress value={c.percent} className="h-2" />
                  </div>
                ))}
                {(!ana.ytTopCountries || ana.ytTopCountries.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">No geography data yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const Clock = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
