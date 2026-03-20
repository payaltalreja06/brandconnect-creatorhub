import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, User, Building2, ArrowRight, Mail, Lock, Camera, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, API_URL } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

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

  // Google OAuth state
  const [googleCredential, setGoogleCredential] = useState<string | null>(null);
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Check if form is valid for submission
  const isFormValid = () => {
    if (!selectedRole) return false;
    
    if (isGoogleSignup) {
      // For Google signup, password not required but profile fields are required
      if (!email) return false;
      if (selectedRole === "influencer" && !name) return false;
      if (selectedRole === "brand" && !brandName) return false;
      
      // Check required profile fields for Google signup too
      if (selectedRole === "influencer") {
        // At least one social media handle required for influencers
        if (!instagram && !tiktok && !youtube) return false;
      } else if (selectedRole === "brand") {
        // Website required for brands
        if (!website) return false;
      }
    } else {
      // For regular signup, password required
      if (!email || !password) return false;
      if (selectedRole === "influencer" && !name) return false;
      if (selectedRole === "brand" && !brandName) return false;
      
      // Check required profile fields for regular signup
      if (selectedRole === "influencer") {
        // At least one social media handle required for regular signup
        if (!instagram && !tiktok && !youtube) return false;
      } else if (selectedRole === "brand") {
        // Website required for regular signup
        if (!website) return false;
      }
    }
    
    return true;
  };

  const handleRoleSelect = (role: "influencer" | "brand") => {
    setSelectedRole(role);
    setStep("details");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsLoading(true);
    try {
      let res;
      
      if (isGoogleSignup && googleCredential) {
        // Google signup with additional profile data
        const payload: any = {
          credential: googleCredential,
          role: selectedRole,
        };

        if (selectedRole === "influencer") {
          payload.profile = { socials: { instagram, tiktok, youtube } };
        } else {
          payload.brand = { website };
        }

        res = await axios.post(`${API_URL}/google`, payload);
      } else {
        // Regular email/password signup
        const payload: any = {
          email,
          password,
          role: selectedRole,
          name: selectedRole === "influencer" ? name : brandName,
        };

        if (selectedRole === "influencer") {
          payload.profile = { socials: { instagram, tiktok, youtube } };
        } else {
          payload.brand = { website };
        }

        res = await axios.post(`${API_URL}/signup`, payload);
      }
      
      login(res.data.token, res.data.user);
      toast.success("Account created successfully!");
      navigate(selectedRole === "influencer" ? "/influencer/dashboard" : "/brand/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      
      if (errorMessage?.includes('Account already exists')) {
        toast.error("An account with this email already exists. Please use the login page instead.");
        // Reset Google state and redirect to login
        setGoogleCredential(null);
        setIsGoogleSignup(false);
        setEmail('');
        setPassword('');
        return;
      }
      
      if (error.response?.data?.incompleteSignup) {
        toast.error("Your account exists but signup is incomplete. Please complete the signup process.");
        // Reset Google state
        setGoogleCredential(null);
        setIsGoogleSignup(false);
        return;
      }
      
      if (error.response?.data?.incompleteProfile) {
        toast.error("Your account exists but profile is incomplete. Please complete signup first.");
        // Reset Google state
        setGoogleCredential(null);
        setIsGoogleSignup(false);
        return;
      }
      
      toast.error(errorMessage || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      // Decode the Google JWT to get user info
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      // Pre-fill form fields
      setEmail(decoded.email || '');
      if (selectedRole === "influencer") {
        setName(decoded.name || '');
      } else {
        setBrandName(decoded.name || '');
      }
      
      // Store credential for later use
      setGoogleCredential(credentialResponse.credential);
      setIsGoogleSignup(true);
      
      toast.success("Google account connected! Please complete your profile.");
    } catch (error: any) {
      toast.error("Failed to process Google account");
    }
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
                           disabled={isGoogleSignup} // Disable if Google was used
                         />
                         {isGoogleSignup && (
                           <p className="text-xs text-green-600 mt-1">✓ Verified by Google</p>
                         )}
                       </div>
                    </div>

                    {!isGoogleSignup && (
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
                    )}

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
                          <label className="text-sm font-medium">Instagram Username <span className="text-red-500">*</span></label>
                          <Input
                            type="text"
                            placeholder="@username"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">TikTok Username <span className="text-red-500">*</span></label>
                          <Input
                            type="text"
                            placeholder="@username"
                            value={tiktok}
                            onChange={(e) => setTiktok(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">YouTube Channel URL <span className="text-red-500">*</span></label>
                          <Input
                            type="url"
                            placeholder="https://youtube.com/c/yourchannel"
                            value={youtube}
                            onChange={(e) => setYoutube(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">At least one social media account is required</p>
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
                          <label className="text-sm font-medium">Company Website <span className="text-red-500">*</span></label>
                          <div className="relative">
                             <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                             <Input
                               type="url"
                               required
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
                      onClick={() => { 
                        setStep("role"); 
                        setSelectedRole(null);
                        // Reset Google state when going back
                        setGoogleCredential(null);
                        setIsGoogleSignup(false);
                      }}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading || !isFormValid()} className="flex-1 gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0">
                      {isLoading ? "Creating..." : "Complete Sign Up"} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="flex justify-center flex-col items-center pb-2">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error("Google login failed")}
                      width="350px"
                      text={isGoogleSignup ? "continue_with" : "signup_with"}
                    />
                    {isGoogleSignup && (
                      <p className="text-xs text-muted-foreground mt-2">Google account connected - complete your profile below</p>
                    )}
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
