import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Youtube, Instagram, Users, TrendingUp, Edit, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { influencers } from "@/data/dummy";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

export default function ProfilePage() {
  const me = influencers[0]; // Dummy: logged in as first influencer

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2"><Edit className="w-4 h-4" /> Edit</Button>
            <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-5">
              <img src={me.avatar} alt={me.name} className="w-20 h-20 rounded-full bg-muted" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{me.name}</h2>
                  {me.verified && <BadgeCheck className="w-5 h-5 text-accent" />}
                </div>
                <p className="text-muted-foreground text-sm mb-1">{me.handle}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-3.5 h-3.5" /> {me.location}
                </div>
                <p className="text-sm mb-3">{me.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {me.domain.map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: "Followers", value: formatNumber(me.followers) },
            { icon: TrendingUp, label: "Engagement", value: me.engagement + "%" },
            { icon: Youtube, label: "YouTube", value: formatNumber(me.ytSubscribers || 0) },
            { icon: Instagram, label: "Instagram", value: formatNumber(me.instaFollowers || 0) },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <s.icon className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Collaboration Rate</CardTitle></CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{me.rate}</p>
            <p className="text-sm text-muted-foreground">per campaign</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
