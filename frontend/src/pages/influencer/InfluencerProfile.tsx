import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Youtube, Instagram, Shield, Edit, Plus, Trash } from "lucide-react";
import { influencers, FAQ } from "@/data/dummy";

export default function InfluencerProfile() {
  const profile = influencers[0]; // Current user
  const [faqs, setFaqs] = useState<FAQ[]>(profile.faqs || []);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const handleAddFaq = () => {
    if (!newFaqQ || !newFaqA) return;
    setFaqs([...faqs, { question: newFaqQ, answer: newFaqA }]);
    setNewFaqQ("");
    setNewFaqA("");
    setIsFaqOpen(false);
  };
  
  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground text-sm">Manage how brands see you</p>
        </div>
        <Button variant="outline" className="gap-2"><Edit className="w-4 h-4" /> Edit Profile</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-2xl bg-muted" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{profile.name}</h2>
                {profile.verified && <Shield className="w-5 h-5 text-accent" />}
              </div>
              <p className="text-muted-foreground text-sm">{profile.handle}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" /> {profile.location}
              </div>
              <div className="flex gap-2 mt-3">
                {profile.domain.map(d => <Badge key={d} variant="secondary">{d}</Badge>)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Bio</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{profile.bio}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Platform Stats</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Youtube className="w-4 h-4 text-red-500" /> YouTube</div>
              <span className="font-medium">{(profile.ytSubscribers! / 1000000).toFixed(1)}M subscribers</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500" /> Instagram</div>
              <span className="font-medium">{(profile.instaFollowers! / 1000).toFixed(0)}K followers</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Collaboration Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium">{profile.rate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Engagement Rate</span>
              <span className="font-medium">{profile.engagement}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Followers</span>
              <span className="font-medium">{(profile.followers / 1000000).toFixed(1)}M</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">My FAQs</CardTitle>
          <Dialog open={isFaqOpen} onOpenChange={setIsFaqOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1"><Plus className="w-3 h-3" /> Add FAQ</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add FAQ</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question</label>
                  <Input value={newFaqQ} onChange={e => setNewFaqQ(e.target.value)} placeholder="e.g. Do you offer UGC?" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Answer</label>
                  <Textarea value={newFaqA} onChange={e => setNewFaqA(e.target.value)} placeholder="e.g. Yes..." rows={3} />
                </div>
                <Button className="w-full" onClick={handleAddFaq}>Add FAQ</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.length === 0 && <p className="text-sm text-muted-foreground">No FAQs added yet.</p>}
          {faqs.map((faq, i) => (
            <div key={i} className="group relative border rounded-lg p-3 text-sm">
              <Button variant="ghost" size="icon" onClick={() => handleRemoveFaq(i)} className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash className="w-3 h-3" />
              </Button>
              <p className="font-semibold mb-1 pr-6">{faq.question}</p>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
