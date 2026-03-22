import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, Loader2, Mail, Lock, User, Building2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Step = "role" | "form";

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<"influencer" | "brand" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (role: "influencer" | "brand") => {
    setSelectedRole(role);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (!selectedRole) { setError("Please select a role"); return; }

    setIsLoading(true);
    try {
      await register(name, email, password, selectedRole);
      toast.success("Account created! Welcome to Collabrix 🎉");
      
      const savedUserString = localStorage.getItem("user");
      if (savedUserString) {
        const u = JSON.parse(savedUserString);
        if (!u.setupComplete) {
            navigate("/complete-profile");
        } else {
            navigate(selectedRole === "influencer" ? "/influencer/dashboard" : "/brand/dashboard");
        }
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Collabrix
          </span>
        </div>

        {step === "role" ? (
          <Card className="shadow-xl border-border/50">
            <CardHeader className="pb-4 text-center">
              <h1 className="text-2xl font-bold">Get started</h1>
              <p className="text-muted-foreground text-sm">Choose how you want to join</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect("influencer")}
                className="w-full flex items-center gap-4 p-5 rounded-xl border-2 border-border hover:border-accent hover:bg-accent/5 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">I'm a Creator / Influencer</p>
                  <p className="text-sm text-muted-foreground">Manage content, analytics & connect with brands</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect("brand")}
                className="w-full flex items-center gap-4 p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">I'm a Brand</p>
                  <p className="text-sm text-muted-foreground">Discover creators, manage campaigns & track ROI</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </motion.button>

              <div className="text-center text-sm text-muted-foreground pt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep("role")}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  ← Back
                </button>
                <div>
                  <h1 className="text-xl font-bold">
                    {selectedRole === "influencer" ? "Creator Account" : "Brand Account"}
                  </h1>
                  <p className="text-muted-foreground text-sm">Fill in your details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">{selectedRole === "brand" ? "Brand Name" : "Full Name"}</Label>
                  <Input
                    id="name"
                    placeholder={selectedRole === "brand" ? "Your Brand Name" : "Your Full Name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
