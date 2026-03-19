import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/influencers" element={<InfluencersPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Influencer routes */}
            <Route path="/influencer/dashboard" element={<InfluencerLayout><InfluencerDashboard /></InfluencerLayout>} />
            <Route path="/influencer/analytics" element={<InfluencerLayout><InfluencerAnalytics /></InfluencerLayout>} />
            <Route path="/influencer/campaigns" element={<InfluencerLayout><InfluencerCampaigns /></InfluencerLayout>} />
            <Route path="/influencer/brands" element={<InfluencerLayout><InfluencerBrands /></InfluencerLayout>} />
            <Route path="/influencer/brand/:id" element={<InfluencerLayout><BrandProfilePage /></InfluencerLayout>} />
            <Route path="/influencer/messages" element={<InfluencerLayout><InfluencerMessages /></InfluencerLayout>} />
            <Route path="/influencer/revenue" element={<InfluencerLayout><InfluencerRevenue /></InfluencerLayout>} />
            <Route path="/influencer/schedule" element={<InfluencerLayout><InfluencerSchedule /></InfluencerLayout>} />
            <Route path="/influencer/profile" element={<InfluencerLayout><InfluencerProfile /></InfluencerLayout>} />

            {/* Brand routes */}
            <Route path="/brand/dashboard" element={<BrandLayout><BrandDashboard /></BrandLayout>} />
            <Route path="/brand/discover" element={<BrandLayout><BrandDiscover /></BrandLayout>} />
            <Route path="/brand/influencer/:id" element={<BrandLayout><InfluencerProfilePage /></BrandLayout>} />
            <Route path="/brand/campaigns" element={<BrandLayout><BrandCampaigns /></BrandLayout>} />
            <Route path="/brand/messages" element={<BrandLayout><BrandMessages /></BrandLayout>} />
            <Route path="/brand/analytics" element={<BrandLayout><BrandAnalytics /></BrandLayout>} />
            <Route path="/brand/payments" element={<BrandLayout><BrandPayments /></BrandLayout>} />
            <Route path="/brand/profile" element={<BrandLayout><BrandProfile /></BrandLayout>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
