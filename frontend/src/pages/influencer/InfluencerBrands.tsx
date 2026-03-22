import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Globe, Megaphone, Loader2 } from "lucide-react";
import { brandApi, requestApi } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function InfluencerBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pitch state
  const [pitchOpen, setPitchOpen] = useState(false);
  const [pitchingTo, setPitchingTo] = useState<any>(null);
  const [pitchCampaign, setPitchCampaign] = useState("");
  const [pitchMsg, setPitchMsg] = useState("");
  const [pitchLoading, setPitchLoading] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandApi.getAll();
        setBrands(res.data);
      } catch {
        toast.error("Failed to load brands");
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const handlePitch = async () => {
    if (!pitchCampaign.trim()) { toast.error("Campaign name required"); return; }
    setPitchLoading(true);
    try {
      await requestApi.send({
        toUserId: pitchingTo.userId,
        campaignName: pitchCampaign,
        message: pitchMsg
      });
      toast.success(`Pitch sent to ${pitchingTo.name}! 🎉`);
      setPitchOpen(false);
      setPitchCampaign("");
      setPitchMsg("");
    } catch {
      toast.error("Failed to send pitch");
    } finally {
      setPitchLoading(false);
    }
  };

  const filtered = (brands || []).filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.domain && b.domain.toLowerCase().includes(search.toLowerCase())) ||
    (b.industry && b.industry.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Browse Brands</h1>
        <p className="text-muted-foreground text-sm">Discover brands and send collaboration requests</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search brands by name, domain or industry..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <Card key={b._id || b.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  {b.logo && b.logo.startsWith('http') ? (
                    <img src={b.logo} alt={b.name} className="w-12 h-12 rounded-xl object-cover bg-muted shrink-0 shadow-sm" />
                  ) : (
                    <span className="text-4xl shrink-0">{b.logo || "🏢"}</span>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg truncate">{b.name}</h3>
                    <Badge variant="secondary" className="text-xs mt-1">{b.industry || b.domain || "General"}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{b.description}</p>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2 truncate"><Globe className="w-3.5 h-3.5" />{b.website || "N/A"}</div>
                  <div className="flex items-center gap-2"><Megaphone className="w-3.5 h-3.5" />{b.campaigns || 0} campaigns</div>
                  <div className="flex items-center gap-2 truncate">💰 Budget: {b.budget || "Contact for info"}</div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/influencer/brand/${b.userId}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      View Profile
                    </Button>
                  </Link>

                  <Dialog open={pitchOpen && pitchingTo?.userId === b.userId} onOpenChange={(o) => { setPitchOpen(o); if(o) setPitchingTo(b); }}>
                    <DialogTrigger asChild>
                      <Button className="flex-1 gap-2" size="sm">
                        <Send className="w-3.5 h-3.5" /> Pitch
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pitch to {b.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Proposal for Campaign *</label>
                          <Input placeholder="e.g. Wellness Summer Collab" value={pitchCampaign} onChange={e => setPitchCampaign(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Your Message / Proposal</label>
                          <Textarea placeholder="Share your ideas for this brand..." rows={4} value={pitchMsg} onChange={e => setPitchMsg(e.target.value)} />
                        </div>
                        <Button className="w-full" onClick={handlePitch} disabled={pitchLoading}>
                          {pitchLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Send Pitch
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
