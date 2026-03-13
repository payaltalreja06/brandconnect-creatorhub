import { useState } from "react";
import { motion } from "framer-motion";
import { Youtube, Instagram, TrendingUp, Eye, Clock, ThumbsUp, MessageSquare, Share2, Bookmark, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ytAnalytics, instaAnalytics } from "@/data/dummy";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

const COLORS = ["hsl(12,80%,62%)", "hsl(222,62%,18%)", "hsl(173,58%,39%)", "hsl(43,96%,56%)"];

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-1">Content Analytics</h1>
        <p className="text-muted-foreground mb-8">Track your YouTube & Instagram performance</p>
      </motion.div>

      <Tabs defaultValue="youtube" className="space-y-6">
        <TabsList>
          <TabsTrigger value="youtube" className="gap-2"><Youtube className="w-4 h-4" /> YouTube</TabsTrigger>
          <TabsTrigger value="instagram" className="gap-2"><Instagram className="w-4 h-4" /> Instagram</TabsTrigger>
        </TabsList>

        {/* YouTube Tab */}
        <TabsContent value="youtube" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Eye} label="Total Views" value={formatNumber(ytAnalytics.overview.totalViews)} />
            <StatCard icon={Users} label="Subscribers" value={formatNumber(ytAnalytics.overview.subscribers)} />
            <StatCard icon={Clock} label="Avg Watch Time" value={ytAnalytics.overview.avgWatchTime} />
            <StatCard icon={TrendingUp} label="Total Videos" value={String(ytAnalytics.overview.totalVideos)} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Monthly Views</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ytAnalytics.monthlyViews}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatNumber(v)} />
                    <Tooltip formatter={(v: number) => formatNumber(v)} />
                    <Bar dataKey="views" fill="hsl(12,80%,62%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Audience Demographics</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={ytAnalytics.demographics} dataKey="percent" nameKey="age" cx="50%" cy="50%" outerRadius={90} label={({ age, percent }) => `${age}: ${percent}%`}>
                      {ytAnalytics.demographics.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Recent Videos Performance</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">CTR</TableHead>
                    <TableHead className="text-right">Avg Duration</TableHead>
                    <TableHead className="text-right">Retention</TableHead>
                    <TableHead className="text-right">Likes</TableHead>
                    <TableHead className="text-right">Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ytAnalytics.recentVideos.map((v) => (
                    <TableRow key={v.title}>
                      <TableCell className="font-medium max-w-[200px] truncate">{v.title}</TableCell>
                      <TableCell className="text-right">{formatNumber(v.views)}</TableCell>
                      <TableCell className="text-right">{v.ctr}%</TableCell>
                      <TableCell className="text-right">{v.avgViewDuration}</TableCell>
                      <TableCell className="text-right">{v.retention}%</TableCell>
                      <TableCell className="text-right">{formatNumber(v.likes)}</TableCell>
                      <TableCell className="text-right">{formatNumber(v.comments)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instagram Tab */}
        <TabsContent value="instagram" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Followers" value={formatNumber(instaAnalytics.overview.followers)} />
            <StatCard icon={Eye} label="Reach" value={formatNumber(instaAnalytics.overview.reach)} />
            <StatCard icon={TrendingUp} label="Impressions" value={formatNumber(instaAnalytics.overview.impressions)} />
            <StatCard icon={Users} label="Profile Visits" value={formatNumber(instaAnalytics.overview.profileVisits)} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Weekly Reach</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={instaAnalytics.weeklyReach}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatNumber(v)} />
                    <Tooltip formatter={(v: number) => formatNumber(v)} />
                    <Line type="monotone" dataKey="reach" stroke="hsl(12,80%,62%)" strokeWidth={2} dot={{ fill: "hsl(12,80%,62%)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Engagement by Content Type</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={instaAnalytics.engagementByType} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="type" tick={{ fontSize: 12 }} width={70} />
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Bar dataKey="rate" fill="hsl(222,62%,18%)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Recent Posts Performance</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Reach</TableHead>
                    <TableHead className="text-right">Likes</TableHead>
                    <TableHead className="text-right">Comments</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Saves</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instaAnalytics.recentPosts.map((p) => (
                    <TableRow key={p.caption}>
                      <TableCell className="font-medium max-w-[200px] truncate">{p.caption}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{p.type}</Badge></TableCell>
                      <TableCell className="text-right">{formatNumber(p.reach)}</TableCell>
                      <TableCell className="text-right">{formatNumber(p.likes)}</TableCell>
                      <TableCell className="text-right">{formatNumber(p.comments)}</TableCell>
                      <TableCell className="text-right">{formatNumber(p.shares)}</TableCell>
                      <TableCell className="text-right">{formatNumber(p.saves)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
