import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, BadgeCheck, MapPin, Youtube, Instagram, Users, TrendingUp, DollarSign, Send, MessageCircle, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { influencerApi, requestApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { influencers, ytAnalytics, instaAnalytics } from "@/data/dummy";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

interface InfluencerData {
  _id?: string;
  userId?: string;
  id?: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  domain: string[];
  followers: number;
  engagement: number;
  ytSubscribers: number;
  instaFollowers: number;
  rate: string;
  verified: boolean;
  faqs?: { question: string; answer: string }[];
}

export default function InfluencerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [inf, setInf] = useState<InfluencerData | null>(null);
  const [loading, setLoading] = useState(true);

  // Collab request state
  const [reqOpen, setReqOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [reqMessage, setReqMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [reqLoading, setReqLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await influencerApi.getById(id!);
        setInf(res.data);
      } catch {
        // Fallback to dummy data
        const dummy = influencers.find(i => i.id === id);
        if (dummy) setInf(dummy as unknown as InfluencerData);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  const handleSendRequest = async () => {
    if (!campaignName) { toast.error("Campaign name is required"); return; }
    if (!isLoggedIn) { toast.error("Please login to send requests"); return; }

    setReqLoading(true);
    try {
      // THE FIX: We MUST send the actual USER ID, not the InfluencerProfile ID.
      // API returns profile as 'inf', where inf.userId is the User ID.
      const toUserId = inf?.userId || inf?._id || inf?.id;
      if (!toUserId) { toast.error("Could not find influencer ID"); return; }

      await requestApi.send({
        toUserId,
        campaignName,
        message: reqMessage,
        budget,
      });
      toast.success("Collaboration request sent! They'll see it in their notifications 🎉");
      setReqOpen(false);
      setCampaignName("");
      setReqMessage("");
      setBudget("");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr?.response?.data?.message || "Failed to send request");
    } finally {
      setReqLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!inf) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Influencer not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

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
                  {inf.domain?.map((d) => <Badge key={d} variant="secondary">{d}</Badge>)}
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* Send Collaboration Request */}
                  {isLoggedIn && user?.role === "brand" ? (
                    <Dialog open={reqOpen} onOpenChange={setReqOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 hover:from-pink-600 hover:to-rose-600">
                          <Send className="w-4 h-4" /> Send Collaboration Request
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Collaboration Request to {inf.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Campaign Name *</label>
                            <Input
                              placeholder="e.g. Summer Skincare Promo"
                              value={campaignName}
                              onChange={(e) => setCampaignName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Budget (optional)</label>
                            <Input
                              placeholder="e.g. ₹1,00,000"
                              value={budget}
                              onChange={(e) => setBudget(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Message / Brief</label>
                            <Textarea
                              placeholder="Describe your campaign goals and deliverables..."
                              rows={4}
                              value={reqMessage}
                              onChange={(e) => setReqMessage(e.target.value)}
                            />
                          </div>
                          <Button className="w-full" onClick={handleSendRequest} disabled={reqLoading}>
                            {reqLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Send Request
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button
                      className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0"
                      onClick={() => toast.info("Login as a brand to send collaboration requests")}
                    >
                      <Send className="w-4 h-4" /> Send Collaboration Request
                    </Button>
                  )}
                  <Button variant="outline" className="gap-2" onClick={() => navigate("/brand/messages")}>
                    <MessageCircle className="w-4 h-4" /> Messages
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

        {/* FAQ Section — influencer's personal FAQs for brands */}
        {inf.faqs && inf.faqs.length > 0 && (
          <Card className="mb-6 overflow-hidden border-none shadow-sm ring-1 ring-border/50">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    💬 Frequently Asked Questions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Direct answers from {inf.name.split(' ')[0]} for potential brand partners</p>
                </div>
                <Badge variant="outline" className="bg-background font-medium shrink-0">
                  {inf.faqs.length} Q&A
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {inf.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/50 last:border-0 px-6">
                    <AccordionTrigger className="hover:no-underline py-5 group">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                          <span className="text-xs font-bold text-primary">Q</span>
                        </div>
                        <span className="font-semibold text-base transition-colors group-hover:text-primary leading-tight">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-muted-foreground text-[15px] leading-relaxed pl-12 pr-4">
                      <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-transparent rounded-full" />
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Recent Content Preview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Youtube className="w-4 h-4" /> Recent YouTube Videos
              </CardTitle>
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
              <CardTitle className="text-base flex items-center gap-2">
                <Instagram className="w-4 h-4" /> Recent Instagram Posts
              </CardTitle>
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
