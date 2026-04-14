import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Youtube, Instagram, Shield, Edit, Plus, Trash, Loader2, Save, X } from "lucide-react";
import { influencerApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Camera } from "lucide-react";
import { getAvatarUrl } from "@/lib/utils";

interface FAQ {
  question: string;
  answer: string;
}

interface Profile {
  _id?: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  domain: string[];
  rate: string;
  engagement: number;
  followers: number;
  ytSubscribers: number;
  instaFollowers: number;
  verified: boolean;
  faqs: FAQ[];
  website?: string;
  instagram?: string;
  youtube?: string;
}

export default function InfluencerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);



  // Edit profile state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editHandle, setEditHandle] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editRate, setEditRate] = useState("");
  const [editWebsite, setEditWebsite] = useState("");

  // FAQ state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [editFaqIndex, setEditFaqIndex] = useState<number | null>(null);
  const [savingFaqs, setSavingFaqs] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await influencerApi.getMe();
        setProfile(res.data);
        setFaqs(res.data.faqs || []);
        setEditName(res.data.name || "");
        setEditHandle(res.data.handle || "");
        setEditBio(res.data.bio || "");
        setEditLocation(res.data.location || "");
        setEditRate(res.data.rate || "");
        setEditWebsite(res.data.website || "");
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await influencerApi.updateMe({
        name: editName,
        handle: editHandle,
        bio: editBio,
        location: editLocation,
        rate: editRate,
        website: editWebsite,
      });
      setProfile(res.data);
      setEditOpen(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddOrEditFaq = () => {
    if (!newFaqQ || !newFaqA) return;
    let updatedFaqs: FAQ[];
    if (editFaqIndex !== null) {
      updatedFaqs = faqs.map((f, i) => i === editFaqIndex ? { question: newFaqQ, answer: newFaqA } : f);
    } else {
      updatedFaqs = [...faqs, { question: newFaqQ, answer: newFaqA }];
    }
    setFaqs(updatedFaqs);
    setNewFaqQ("");
    setNewFaqA("");
    setEditFaqIndex(null);
    setIsFaqOpen(false);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const startEditFaq = (index: number) => {
    setEditFaqIndex(index);
    setNewFaqQ(faqs[index].question);
    setNewFaqA(faqs[index].answer);
    setIsFaqOpen(true);
  };

  const handleSaveFaqs = async () => {
    setSavingFaqs(true);
    try {
      await influencerApi.updateFaqs(faqs);
      toast.success("FAQs saved! Brands will see these on your profile 🎉");
    } catch {
      toast.error("Failed to save FAQs");
    } finally {
      setSavingFaqs(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const res = await influencerApi.uploadAvatar(formData);
      setProfile(prev => prev ? { ...prev, avatar: res.data.avatarUrl } : null);
      toast.success("Profile photo updated!");
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) return;
    setUploading(true);
    try {
      await influencerApi.removeAvatar();
      setProfile(prev => prev ? { ...prev, avatar: "" } : null);
      toast.success("Profile photo removed");
    } catch {
      toast.error("Failed to remove photo");
    } finally {
      setUploading(false);
    }
  };

  // getAvatarUrl removed - now using shared util from @/lib/utils

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground text-sm">Manage how brands see you</p>
        </div>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" /> Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2 max-h-[70vh] overflow-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Handle</Label>
                  <Input value={editHandle} onChange={e => setEditHandle(e.target.value)} placeholder="@yourhandle" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Bio</Label>
                <Textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Tell brands about yourself..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="City, Country" />
                </div>
                <div className="space-y-1.5">
                  <Label>Rate</Label>
                  <Input value={editRate} onChange={e => setEditRate(e.target.value)} placeholder="e.g. ₹50,000 - ₹1,00,000" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Website</Label>
                <Input value={editWebsite} onChange={e => setEditWebsite(e.target.value)} placeholder="https://yoursite.com" />
              </div>
              <Button className="w-full" onClick={handleSaveProfile} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative group shrink-0">
              <img 
                src={getAvatarUrl(profile.avatar || user?.avatar)} 
                alt={profile.name} 
                className="w-24 h-24 rounded-2xl bg-muted object-cover border border-border" 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                <label className="cursor-pointer hover:scale-110 transition-transform">
                  {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
                {(profile.avatar || user?.avatar) && (
                  <button 
                    onClick={handleRemoveAvatar} 
                    className="hover:scale-110 transition-transform text-red-400" 
                    title="Remove Photo"
                    disabled={uploading}
                  >
                    <Trash className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{profile.name}</h2>
                {profile.verified && <Shield className="w-5 h-5 text-accent" />}
              </div>
              <p className="text-muted-foreground text-sm">{profile.handle}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" /> {profile.location || "Location not set"}
              </div>
              {profile.bio && <p className="text-sm mt-2 max-w-xl">{profile.bio}</p>}
              <div className="flex gap-2 mt-3 flex-wrap">
                {profile.domain?.map(d => <Badge key={d} variant="secondary">{d}</Badge>)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Platform Stats</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Youtube className="w-4 h-4 text-red-500" /> YouTube</div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">{profile.ytSubscribers ? (profile.ytSubscribers / 1000).toFixed(0) + "K subs" : "Pending"}</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:bg-red-50 px-2" onClick={() => toast.success("YouTube Live Sync Active")}>Re-sync</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500" /> Instagram</div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-sm">{profile.instaFollowers ? (profile.instaFollowers / 1000).toFixed(0) + "K followers" : "Pending"}</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:bg-blue-50 px-2" onClick={() => toast.success("Meta Insights Sync Active")}>Re-sync</Button>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-2 gap-2 text-xs h-9 border-dashed" onClick={() => toast.info("Social Account Selector... (Manager Mode)")}>
               <Shield className="w-3.5 h-3.5" /> Manage OAuth Connections
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Collaboration Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium">{profile.rate || "Not set"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Engagement Rate</span>
              <span className="font-medium">{profile.engagement || 0}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Followers</span>
              <span className="font-medium">{profile.followers ? (profile.followers / 1000000).toFixed(1) + "M" : "0"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQs — brands will see these */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">My FAQs for Brands</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              These appear on your public profile so brands can learn about you before reaching out
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isFaqOpen} onOpenChange={(o) => { setIsFaqOpen(o); if (!o) { setEditFaqIndex(null); setNewFaqQ(""); setNewFaqA(""); } }}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Plus className="w-3 h-3" /> Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editFaqIndex !== null ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input value={newFaqQ} onChange={e => setNewFaqQ(e.target.value)} placeholder="e.g. Do you offer UGC videos?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea value={newFaqA} onChange={e => setNewFaqA(e.target.value)} placeholder="Your answer..." rows={3} />
                  </div>
                  <Button className="w-full" onClick={handleAddOrEditFaq} disabled={!newFaqQ || !newFaqA}>
                    {editFaqIndex !== null ? "Update FAQ" : "Add FAQ"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {faqs.length > 0 && (
              <Button size="sm" className="h-8 gap-1" onClick={handleSaveFaqs} disabled={savingFaqs}>
                {savingFaqs ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Save FAQs
              </Button>
            )}
          </div>
        </CardHeader>
          <CardContent className="p-0">
            {faqs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No FAQs added yet.</p>
                <p className="text-xs mt-1 italic">Add FAQs to help brands understand your collaboration style</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/50 last:border-0 px-6 group relative">
                    <div className="absolute top-4 right-12 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); startEditFaq(i); }} className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleRemoveFaq(i); }} className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <AccordionTrigger className="hover:no-underline py-5 pr-20 group/trigger">
                      <span className="text-left font-semibold text-base transition-colors group-hover/trigger:text-primary leading-tight">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-muted-foreground text-[15px] leading-relaxed pl-1">
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 shrink-0" />
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {faqs.length > 0 && (
              <div className="p-4 bg-muted/20 border-t border-border/50">
                <p className="text-xs text-muted-foreground text-center italic">
                  Changes must be saved using the "Save FAQs" button above to go live.
                </p>
              </div>
            )}
          </CardContent>
      </Card>
    </div>
  );
}
