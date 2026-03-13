import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Eye, ThumbsUp, MessageCircle, Share2, Clock, MousePointerClick, Users, TrendingUp } from "lucide-react";
import { ytAnalytics, instaAnalytics } from "@/data/dummy";

const COLORS = ["hsl(12,80%,62%)", "hsl(222,62%,18%)", "hsl(173,58%,39%)", "hsl(43,96%,56%)", "hsl(262,52%,55%)"];

export default function InfluencerAnalytics() {
  const [tab, setTab] = useState("youtube");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Deep dive into your platform performance</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="cross-platform">Cross-Platform</TabsTrigger>
        </TabsList>

        {/* YOUTUBE */}
        <TabsContent value="youtube" className="space-y-4 mt-4">
          {/* YT KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Subscribers", value: "1.8M", icon: Users },
              { label: "Total Views", value: "12.5M", icon: Eye },
              { label: "Avg Watch Time", value: "4:32", icon: Clock },
              { label: "Total Videos", value: "245", icon: TrendingUp },
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

          {/* Monthly Views */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Monthly Views</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
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

          {/* Video Performance Table */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Video Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground">Video</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Views</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Likes</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">CTR</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Retention</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ytAnalytics.recentVideos.map((v) => (
                      <tr key={v.title} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-2.5 font-medium max-w-[200px] truncate">{v.title}</td>
                        <td className="py-2.5 text-right">{(v.views/1000).toFixed(0)}K</td>
                        <td className="py-2.5 text-right">{(v.likes/1000).toFixed(0)}K</td>
                        <td className="py-2.5 text-right">{v.ctr}%</td>
                        <td className="py-2.5 text-right">{v.retention}%</td>
                        <td className="py-2.5 text-right">{v.avgViewDuration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Demographics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Age Groups</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ytAnalytics.demographics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                    <XAxis dataKey="age" tick={{ fontSize: 11 }} stroke="hsl(215,16%,47%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(215,16%,47%)" />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Audience"]} />
                    <Bar dataKey="percent" fill="hsl(222,62%,18%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Gender Split</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={ytAnalytics.genderSplit} dataKey="percent" nameKey="gender" cx="50%" cy="50%" outerRadius={65} label={({ gender, percent }) => `${gender}: ${percent}%`}>
                      {ytAnalytics.genderSplit.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top Countries</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3 pt-2">
                  {ytAnalytics.topCountries.map((c, i) => (
                    <div key={c.country} className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs text-muted-foreground">{i + 1}</span>
                      <span className="flex-1 text-sm">{c.country}</span>
                      <span className="text-sm font-medium">{c.percent}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* INSTAGRAM */}
        <TabsContent value="instagram" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Followers", value: "600K", icon: Users },
              { label: "Reach", value: "2.8M", icon: Eye },
              { label: "Impressions", value: "5.2M", icon: TrendingUp },
              { label: "Profile Visits", value: "45K", icon: MousePointerClick },
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

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Weekly Reach</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={instaAnalytics.weeklyReach}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: number) => [`${(v/1000).toFixed(0)}K`, "Reach"]} />
                  <Line type="monotone" dataKey="reach" stroke="hsl(262,52%,55%)" strokeWidth={2} dot={{ fill: "hsl(262,52%,55%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Post Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground">Post</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Type</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Likes</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Comments</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Shares</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Reach</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instaAnalytics.recentPosts.map((p) => (
                      <tr key={p.caption} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-2.5 font-medium max-w-[180px] truncate">{p.caption}</td>
                        <td className="py-2.5 text-center"><Badge variant="secondary" className="text-xs">{p.type}</Badge></td>
                        <td className="py-2.5 text-right">{(p.likes/1000).toFixed(0)}K</td>
                        <td className="py-2.5 text-right">{(p.comments/1000).toFixed(1)}K</td>
                        <td className="py-2.5 text-right">{(p.shares/1000).toFixed(1)}K</td>
                        <td className="py-2.5 text-right">{(p.reach/1000).toFixed(0)}K</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Engagement by Content Type</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={instaAnalytics.engagementByType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                  <XAxis dataKey="type" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                  <Tooltip formatter={(v: number) => [`${v}%`, "Engagement"]} />
                  <Bar dataKey="rate" fill="hsl(12,80%,62%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CROSS-PLATFORM */}
        <TabsContent value="cross-platform" className="space-y-4 mt-4">
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
                      <th className="text-right py-2 font-medium text-muted-foreground">Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { platform: "YouTube", followers: "1.8M", engagement: "4.8%", growth: "+12.5%", content: "245" },
                      { platform: "Instagram", followers: "600K", engagement: "6.2%", growth: "+18.3%", content: "520" },
                    ].map((p) => (
                      <tr key={p.platform} className="border-b border-border/50">
                        <td className="py-3 font-medium">{p.platform}</td>
                        <td className="py-3 text-right">{p.followers}</td>
                        <td className="py-3 text-right">{p.engagement}</td>
                        <td className="py-3 text-right text-emerald-600">{p.growth}</td>
                        <td className="py-3 text-right">{p.content}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Where Is Your Traffic?</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={[{ name: "YouTube", value: 75 }, { name: "Instagram", value: 25 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      <Cell fill="hsl(12,80%,62%)" />
                      <Cell fill="hsl(262,52%,55%)" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Device Usage</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3 pt-2">
                  {ytAnalytics.deviceUsage.map((d) => (
                    <div key={d.device} className="flex items-center gap-3">
                      <span className="text-sm flex-1">{d.device}</span>
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${d.percent}%` }} />
                      </div>
                      <span className="text-sm font-medium w-10 text-right">{d.percent}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
