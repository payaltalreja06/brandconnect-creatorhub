import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, BarChart3, MessageCircle, ArrowRight, Users, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicNavbar from "@/components/PublicNavbar";
import HowItWorks from "@/components/HowItWorks";
import CampaignsSection from "@/components/CampaignsSection";
import FAQAccordion from "@/components/FAQAccordion";
import ContactUs from "@/components/ContactUs";
import MarketplaceFooter from "@/components/MarketplaceFooter";

const features = [
  { icon: Search, title: "Smart Discovery", desc: "Find influencers by niche, engagement rate, and audience demographics." },
  { icon: BarChart3, title: "Cross-Platform Analytics", desc: "Analyze YouTube & Instagram performance with key KPI metrics." },
  { icon: MessageCircle, title: "Direct Messaging", desc: "Connect and negotiate directly with brands or influencers." },
  { icon: Shield, title: "Verified Profiles", desc: "Trusted profiles with authentic engagement data." },
];

const stats = [
  { value: "10K+", label: "Influencers" },
  { value: "2K+", label: "Brands" },
  { value: "50K+", label: "Collaborations" },
  { value: "98%", label: "Satisfaction" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative py-24 md:py-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-accent/10 text-accent mb-6">
              Where creators meet brands
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6"
          >
            Connect. Collaborate.{" "}
            <span className="text-accent">Grow.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            The marketplace where influencers and brands find each other, analyze performance, and build lasting partnerships.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login">
              <Button size="lg" className="gap-2 px-8 bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2 px-8">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Powerful tools for both influencers and brands to discover, analyze, and connect.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i + 1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <f.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="rounded-2xl bg-primary p-10 md:p-14">
              <Users className="w-10 h-10 text-primary-foreground mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">Ready to grow your reach?</h2>
              <p className="text-primary-foreground/70 mb-6">Join thousands of creators and brands already on Collabrix.</p>
              <Link to="/login">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                  Get Started <TrendingUp className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <HowItWorks />
      <CampaignsSection />
      <FAQAccordion />
      <ContactUs />
      <MarketplaceFooter />
    </div>
  );
}
