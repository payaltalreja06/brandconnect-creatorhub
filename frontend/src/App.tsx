import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ChatProvider } from "@/contexts/ChatContext";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import CompleteProfilePage from "@/pages/CompleteProfilePage";
import NotFound from "@/pages/NotFound";
import InfluencersPage from "@/pages/InfluencersPage";

import InfluencerLayout from "@/components/InfluencerLayout";
import InfluencerDashboard from "@/pages/influencer/InfluencerDashboard";
import InfluencerAnalytics from "@/pages/influencer/InfluencerAnalytics";
import InfluencerCampaigns from "@/pages/influencer/InfluencerCampaigns";
import InfluencerBrands from "@/pages/influencer/InfluencerBrands";
import InfluencerMessages from "@/pages/influencer/InfluencerMessages";
import InfluencerRevenue from "@/pages/influencer/InfluencerRevenue";
import InfluencerSchedule from "@/pages/influencer/InfluencerSchedule";
import InfluencerProfile from "@/pages/influencer/InfluencerProfile";

import BrandLayout from "@/components/BrandLayout";
import BrandDashboard from "@/pages/brand/BrandDashboard";
import BrandDiscover from "@/pages/brand/BrandDiscover";
import BrandCampaigns from "@/pages/brand/BrandCampaigns";
import BrandMessages from "@/pages/brand/BrandMessages";
import BrandAnalytics from "@/pages/brand/BrandAnalytics";
import BrandPayments from "@/pages/brand/BrandPayments";
import BrandProfile from "@/pages/brand/BrandProfile";
import InfluencerProfilePage from "@/pages/InfluencerProfilePage";
import BrandProfilePage from "@/pages/BrandProfilePage";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: "influencer" | "brand" }) {
  const { isLoggedIn, role, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <NotificationProvider>
          <ChatProvider>
            <BrowserRouter>
              <Routes>
                {/* ... */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/influencers" element={<InfluencersPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfilePage /></ProtectedRoute>} />

                {/* Influencer routes */}
                <Route path="/influencer/dashboard" element={<ProtectedRoute requiredRole="influencer"><InfluencerLayout><InfluencerDashboard /></InfluencerLayout></ProtectedRoute>} />
                <Route path="/influencer/analytics" element={<ProtectedRoute requiredRole="influencer"><InfluencerLayout><InfluencerAnalytics /></InfluencerLayout></ProtectedRoute>} />
                <Route path="/influencer/campaigns" element={<ProtectedRoute requiredRole="influencer"><InfluencerLayout><InfluencerCampaigns /></InfluencerLayout></ProtectedRoute>} />
                <Route path="/influencer/brands" element={<ProtectedRoute requiredRole="influencer"><InfluencerLayout><InfluencerBrands /></InfluencerLayout></ProtectedRoute>} />
                <Route path="/influencer/brand/:id" element={<ProtectedRoute requiredRole="influencer"><InfluencerLayout><BrandProfilePage /></InfluencerLayout></ProtectedRoute>} />
                <Route path="/influencer/messages" element={<ProtectedRoute requiredRole="influencer"><InfluencerLayout><InfluencerMessages /></InfluencerLayout></ProtectedRoute>} />
                <Route path="/influencer/revenue" element={<ProtectedRoute requiredRole="influencer"><InfluencerLayout><InfluencerRevenue /></InfluencerLayout></ProtectedRoute>} />
                <Route path="/influencer/schedule" element={<ProtectedRoute requiredRole="influencer"><InfluencerLayout><InfluencerSchedule /></InfluencerLayout></ProtectedRoute>} />
                <Route path="/influencer/profile" element={<ProtectedRoute requiredRole="influencer"><InfluencerLayout><InfluencerProfile /></InfluencerLayout></ProtectedRoute>} />

                {/* Brand routes */}
                <Route path="/brand/dashboard" element={<ProtectedRoute requiredRole="brand"><BrandLayout><BrandDashboard /></BrandLayout></ProtectedRoute>} />
                <Route path="/brand/discover" element={<ProtectedRoute><BrandLayout><BrandDiscover /></BrandLayout></ProtectedRoute>} />
                <Route path="/brand/influencer/:id" element={<ProtectedRoute><BrandLayout><InfluencerProfilePage /></BrandLayout></ProtectedRoute>} />
                <Route path="/brand/campaigns" element={<ProtectedRoute requiredRole="brand"><BrandLayout><BrandCampaigns /></BrandLayout></ProtectedRoute>} />
                <Route path="/brand/messages" element={<ProtectedRoute><BrandLayout><BrandMessages /></BrandLayout></ProtectedRoute>} />
                <Route path="/brand/analytics" element={<ProtectedRoute requiredRole="brand"><BrandLayout><BrandAnalytics /></BrandLayout></ProtectedRoute>} />
                <Route path="/brand/payments" element={<ProtectedRoute requiredRole="brand"><BrandLayout><BrandPayments /></BrandLayout></ProtectedRoute>} />
                <Route path="/brand/profile" element={<ProtectedRoute requiredRole="brand"><BrandLayout><BrandProfile /></BrandLayout></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </NotificationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
