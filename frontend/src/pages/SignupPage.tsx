import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, User, Building2, ArrowRight, Mail, Lock, Camera, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [step, setStep] = useState<"role" | "details">("role");
  const [selectedRole, setSelectedRole] = useState<"influencer" | "brand" | null>(null);
  
  // Influencer specifics
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  
  // Brand specifics
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: "influencer" | "brand") => {
    setSelectedRole(role);
    setStep("details");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    // Using login from context to simulate a sign up and immediate login for now
    const displayName = selectedRole === "influencer" ? (name || "New Influencer") : (brandName || "New Brand");
    login(selectedRole, displayName);
    navigate(selectedRole === "influencer" ? "/influencer/dashboard" : "/brand/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            CollabHub
          </span>
        </Link>

        {step === "role" ? (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Join CollabHub</h1>
              <p className="text-muted-foreground">Are you looking to create content or find creators?</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-md border-2 border-transparent hover:border-accent transition-all group"
                onClick={() => handleRoleSelect("influencer")}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <User className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">I'm a Creator / Influencer</h3>
                    <p className="text-sm text-muted-foreground">Monetize your audience and find brand deals</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                className="cursor-pointer hover:shadow-md border-2 border-transparent hover:border-primary transition-all group"
                onClick={() => handleRoleSelect("brand")}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">I'm a Brand</h3>
                    <p className="text-sm text-muted-foreground">Find creators to promote your products</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </motion.div>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="text-center mb-8">
                  <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${selectedRole === "influencer" ? "bg-accent/10" : "bg-primary/10"}`}>
                    {selectedRole === "influencer" ? <User className="w-6 h-6 text-accent" /> : <Building2 className="w-6 h-6 text-primary" />}
                  </div>
                  <h2 className="text-2xl font-bold">
                    Create {selectedRole === "influencer" ? "Creator" : "Brand"} Account
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Fill out the details below to get started</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                  
                  {/* Photo / Logo Upload Area */}
                  <div className="flex justify-center mb-6">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden transition-colors group-hover:border-primary">
                        <Camera className="w-8 h-8 text-gray-400 mb-1 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest group-hover:text-primary">Upload</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Common Fields */}
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-sm font-medium">Email</label>
                       <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                         <Input
                           type="email"
                           required
                           placeholder="you@example.com"
                           className="pl-10"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                         />
                       </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                       <label className="text-sm font-medium">Password</label>
                       <div className="relative">
                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                         <Input
                           type="password"
                           required
                           placeholder="••••••••"
                           className="pl-10"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                         />
                       </div>
                    </div>

                    {selectedRole === "influencer" && (
                      <>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Full Name</label>
                          <Input
                            type="text"
                            required
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Instagram Username</label>
                          <Input
                            type="text"
                            placeholder="@username"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">TikTok Username</label>
                          <Input
                            type="text"
                            placeholder="@username"
                            value={tiktok}
                            onChange={(e) => setTiktok(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">YouTube Channel URL</label>
                          <Input
                            type="url"
                            placeholder="https://youtube.com/c/yourchannel"
                            value={youtube}
                            onChange={(e) => setYoutube(e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    {selectedRole === "brand" && (
                      <>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Brand / Company Name</label>
                          <Input
                            type="text"
                            required
                            placeholder="Your Brand Name"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Company Website</label>
                          <div className="relative">
                             <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                             <Input
                               type="url"
                               placeholder="https://yourbrand.com"
                               className="pl-10"
                               value={website}
                               onChange={(e) => setWebsite(e.target.value)}
                             />
                           </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => { setStep("role"); setSelectedRole(null); }}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0">
                      Complete Sign Up <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
