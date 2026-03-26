import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { influencerApi, brandApi } from "@/lib/api";
import { toast } from "sonner";
import { Youtube, Instagram, Briefcase, User as UserIcon, Loader2 } from "lucide-react";

export default function CompleteProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Influencer fields
  const [handle, setHandle] = useState("");
  const [ytChannel, setYtChannel] = useState("");
  const [instaHandle, setInstaHandle] = useState("");

  // Brand fields
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user?.role === "influencer") {
        await influencerApi.updateMe({
          handle: handle || `@${user.name.toLowerCase().replace(/\s/g, "")}`,
          youtube: ytChannel,
          instagram: instaHandle,
          setupComplete: true
        });
      } else {
        await brandApi.updateMe({
          website,
          industry,
          setupComplete: true
        });
      }
      
      // Update local storage/state for setupComplete
      const savedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      savedUser.setupComplete = true;
      sessionStorage.setItem("user", JSON.stringify(savedUser));
      
      toast.success("Profile completed successfully!");
      // Redirect to the "Browse" pages for each role
      navigate(user?.role === "influencer" ? "/influencer/brands" : "/brand/discover");
    } catch {
      toast.error("Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>We need a few more details to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {user.role === "influencer" ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-primary" /> Profile Handle *
                  </label>
                  <Input 
                    placeholder="@username" 
                    value={handle} 
                    onChange={e => setHandle(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-500" /> YouTube Channel Link
                  </label>
                  <Input 
                    placeholder="youtube.com/c/yourchannel" 
                    value={ytChannel} 
                    onChange={e => setYtChannel(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-500" /> Instagram Handle
                  </label>
                  <Input 
                    placeholder="@yourinsta" 
                    value={instaHandle} 
                    onChange={e => setInstaHandle(e.target.value)} 
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" /> Industry *
                  </label>
                  <Input 
                    placeholder="e.g., Fashion, Technology" 
                    value={industry} 
                    onChange={e => setIndustry(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input 
                    placeholder="https://company.com" 
                    value={website} 
                    onChange={e => setWebsite(e.target.value)} 
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Finish & Explore
            </Button>
            
            <div className="flex flex-col gap-2 mt-4">
               <Button variant="ghost" type="button" className="w-full text-muted-foreground" onClick={() => navigate(user.role === "brand" ? "/brand/discover" : "/influencer/brands")}>
                    Skip for now & Browse {user.role === "brand" ? "Influencers" : "Brands"}
               </Button>
               <Button variant="link" type="button" className="w-full text-xs text-muted-foreground" onClick={logout}>
                    Sign out
               </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
