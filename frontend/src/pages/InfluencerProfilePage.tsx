import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, BadgeCheck, MapPin, Youtube, Instagram, Users, TrendingUp, DollarSign, Send, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { influencers, ytAnalytics, instaAnalytics } from "@/data/dummy";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

export default function InfluencerProfilePage() {
  const { id } = useParams();
  const inf = influencers.find((i) => i.id === id);

  if (!inf) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Influencer not found.</p>
        <Link to="/discover"><Button variant="outline" className="mt-4">Go Back</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/discover" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Discover
      </Link>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <img src={inf.avatar} alt={inf.name} className="w-24 h-24 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold">{inf.name}</h1>
                  {inf.verified && <BadgeCheck className="w-5 h-5 text-accent" />}
                </div>
                <p className="text-muted-foreground mb-2">{inf.handle}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-3.5 h-3.5" /> {inf.location}
                </div>
                <p className="text-sm mb-4 max-w-xl">{inf.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {inf.domain.map((d) => (
                    <Badge key={d} variant="secondary">{d}</Badge>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 hover:from-pink-600 hover:to-rose-600">
                    <Send className="w-4 h-4" /> Send Collaboration Request
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageCircle className="w-4 h-4" /> Message
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: "Total Followers", value: formatNumber(inf.followers) },
            { icon: TrendingUp, label: "Engagement Rate", value: inf.engagement + "%" },
            { icon: Youtube, label: "YT Subscribers", value: formatNumber(inf.ytSubscribers || 0) },
            { icon: Instagram, label: "IG Followers", value: formatNumber(inf.instaFollowers || 0) },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <s.icon className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rate Card */}
        <Card className="mb-6">
          <CardContent className="p-5 flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-accent" />
            <div>
              <p className="font-semibold">Collaboration Rate</p>
              <p className="text-sm text-muted-foreground">{inf.rate} per campaign</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Content Preview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Youtube className="w-4 h-4" /> Recent YouTube Videos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ytAnalytics.recentVideos.slice(0, 3).map((v) => (
                <div key={v.title} className="flex justify-between items-center text-sm">
                  <span className="truncate flex-1 mr-2">{v.title}</span>
                  <span className="text-muted-foreground shrink-0">{formatNumber(v.views)} views</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Instagram className="w-4 h-4" /> Recent Instagram Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {instaAnalytics.recentPosts.slice(0, 3).map((p) => (
                <div key={p.caption} className="flex justify-between items-center text-sm">
                  <span className="truncate flex-1 mr-2">{p.type}: {p.caption}</span>
                  <span className="text-muted-foreground shrink-0">{formatNumber(p.reach)} reach</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
