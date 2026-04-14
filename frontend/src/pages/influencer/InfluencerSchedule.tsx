import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
const postingData: any[] = [];
const campaigns: any[] = [];

export default function InfluencerSchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const myCampaigns = campaigns.filter(c => c.influencerId);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Posting Schedule</h1>
        <p className="text-muted-foreground text-sm">Analyze your posting consistency and find the best times</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col items-center border-none shadow-none bg-transparent">
           <CardHeader className="w-full px-0 pb-3"><CardTitle className="text-lg">Campaign Calendar</CardTitle></CardHeader>
           <CardContent className="w-full px-0 flex justify-center md:justify-start">
             <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl border bg-card text-card-foreground shadow-sm w-full max-w-[300px]"
             />
           </CardContent>
        </Card>

        <Card className="md:col-span-2">
           <CardHeader className="pb-3"><CardTitle className="text-lg">Upcoming Deadlines</CardTitle></CardHeader>
           <CardContent className="space-y-3">
             {myCampaigns.length > 0 ? myCampaigns.map(c => (
               <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-xl gap-3">
                 <div className="flex items-center gap-3">
                    <span className="text-3xl shrink-0">{c.brandLogo}</span>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{c.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{c.brandName}</p>
                    </div>
                 </div>
                 <div className="sm:text-right shrink-0">
                    <p className="font-medium text-sm">{new Date(c.deadline).toLocaleDateString()}</p>
                    <Badge variant="outline" className="mt-1 capitalize">{c.status.replace("_", " ")}</Badge>
                 </div>
               </div>
             )) : (
               <p className="text-sm text-muted-foreground">No upcoming campaigns.</p>
             )}
           </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {[
          { label: "Posts This Week", value: "5" },
          { label: "Best Time", value: "6 PM" },
          { label: "Best Day", value: "Saturday" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Weekly Posting Frequency</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={postingData.weeklyPosts}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <Tooltip />
                <Bar dataKey="posts" fill="hsl(222,62%,18%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Best Posting Times</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={postingData.bestPostingTimes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <Tooltip formatter={(v: number) => [`${v}%`, "Engagement"]} />
                <Bar dataKey="engagement" fill="hsl(43,96%,56%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Engagement by Day</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={postingData.bestDays}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
              <Tooltip formatter={(v: number) => [`${v}%`, "Engagement"]} />
              <Bar dataKey="engagement" fill="hsl(262,52%,55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
