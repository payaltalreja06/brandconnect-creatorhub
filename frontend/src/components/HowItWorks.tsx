import { motion } from "framer-motion";
import { Search, Shield, MessageCircle, DollarSign, CheckCircle, Lock, Zap } from "lucide-react";

const steps = [
  {
    title: "Search Influencers",
    desc: "Search thousands of vetted Instagram, TikTok, and YouTube influencers.",
    icon: Search,
  },
  {
    title: "Purchase & Chat Securely",
    desc: "Safely purchase and communicate through Collabrix. We hold your payment until the work is completed.",
    icon: Shield,
  },
  {
    title: "Receive Quality Content",
    desc: "Receive your high-quality content from influencers directly through the platform.",
    icon: CheckCircle,
  },
];

const features = [
  {
    icon: DollarSign,
    title: "No Upfront Cost",
    desc: "Search influencers for free. No subscriptions, contracts, or hidden fees.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: CheckCircle,
    title: "Vetted Influencers",
    desc: "Every influencer is vetted by us. Always receive high-quality, professional content.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: MessageCircle,
    title: "Instant Chat",
    desc: "Instantly chat with influencers and stay in touch throughout the whole transaction.",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    icon: Lock,
    title: "Secure Purchases",
    desc: "Your money is held safely until you approve the influencer's work.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row gap-16 items-start mb-20">
          <div className="lg:w-1/2">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white mb-6"
            >
              Search
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight"
            >
              Find and Hire Influencers in Seconds on the Marketplace
            </motion.h2>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <step.icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side — marketplace preview mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 shadow-lg">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      Trending Creator
                    </p>
                    <p className="text-xs text-gray-500">
                      Lifestyle, Fashion, Content creator
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-400 border-t border-gray-50 pt-3">
                  <div className="flex justify-between">
                    <span>Packages</span>
                    <span className="font-medium text-gray-700">from $250</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}
              >
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
