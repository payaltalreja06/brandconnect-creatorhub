import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, Loader2, Mail, Lock, Building2, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, isLoggedIn, user: authUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && authUser) {
      if (!authUser.setupComplete) {
        navigate("/complete-profile");
      } else {
        const dest = authUser.role === "influencer" ? "/influencer/brands" : "/brand/dashboard";
        navigate(dest);
      }
    }
  }, [isLoggedIn, authUser, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const demoAccounts = [
    { name: "Raj Shamani", role: "Influencer", email: "raj.shamani@gmail.com" },
    { name: "Ranveer Allahbadia", role: "Influencer", email: "ranveerallahbadia@gmail.com" },
    { name: "GlowSkin", role: "Brand", email: "glowskin@collabrix.com" },
  ];

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient blobs */}
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
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Collabrix
          </span>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="pb-4 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your account</p>
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
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
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
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 border-t border-border pt-5">
              <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Demo accounts
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {demoAccounts.map((account) => {
                  const Icon = account.role === "Brand" ? Building2 : UserRound;
                  return (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => fillDemoAccount(account.email)}
                      disabled={isLoading}
                      className="rounded-lg border border-border bg-muted/40 p-3 text-left transition-colors hover:border-primary/50 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Use ${account.name} demo account`}
                    >
                      <div className="mb-2 flex items-center gap-1.5 text-primary">
                        <Icon className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">{account.role}</span>
                      </div>
                      <p className="truncate text-sm font-medium">{account.name}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{account.email}</p>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Click an account to fill in its credentials. Password: password123
              </p>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
