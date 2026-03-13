import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { postingData } from "@/data/dummy";

export default function InfluencerSchedule() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Posting Schedule</h1>
        <p className="text-muted-foreground text-sm">Analyze your posting consistency and find the best times</p>
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
