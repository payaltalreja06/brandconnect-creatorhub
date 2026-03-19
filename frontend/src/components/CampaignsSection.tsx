import { motion } from "framer-motion";
import { Target, Send, Users, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "Set Targeting",
    desc: "Specify demographics including niche, location and following size of the influencers you want to target.",
  },
  {
    icon: Send,
    title: "Post Campaign",
    desc: "Centralize your images, requirements, and more in a campaign brief sent to 550,000 influencers.",
  },
  {
    icon: Users,
    title: "Influencers Apply",
    desc: "Targeted influencers submit their pricing, and you choose who to collaborate with.",
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

export default function CampaignsSection() {
  return (
    <section className="py-20 px-4 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left — Campaign Cards Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              {/* Background image grid */}
              <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
                {[
                  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
                ].map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>

              {/* Floating campaign cards */}
              <div className="absolute -bottom-4 -left-4 space-y-3">
                <div className="bg-white rounded-xl shadow-xl p-4 w-64 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=campaign1"
                      className="w-10 h-10 rounded-full bg-gray-100"
                      alt=""
                    />
                    <div>
                      <p className="font-semibold text-sm">$55</p>
                      <p className="text-xs text-gray-500">Fashion & Beauty Content</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs rounded-lg bg-emerald-50 text-emerald-700 font-medium">
                      View Profile
                    </button>
                    <button className="px-3 py-1 text-xs rounded-lg bg-emerald-500 text-white font-medium">
                      Accept
                    </button>
                    <button className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-600 font-medium">
                      Decline
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-xl p-4 w-64 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=campaign2"
                      className="w-10 h-10 rounded-full bg-gray-100"
                      alt=""
                    />
                    <div>
                      <p className="font-semibold text-sm">$150</p>
                      <p className="text-xs text-gray-500">Lifestyle Content Creator</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs rounded-lg bg-emerald-50 text-emerald-700 font-medium">
                      View Profile
                    </button>
                    <button className="px-3 py-1 text-xs rounded-lg bg-emerald-500 text-white font-medium">
                      Accept
                    </button>
                    <button className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-600 font-medium">
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Text Content */}
          <div className="lg:w-1/2">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white mb-6"
            >
              Campaigns
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 leading-tight"
            >
              Post Campaigns and Have 550,000+ Influencers Come to You
            </motion.h2>

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
        </div>
      </div>
    </section>
  );
}
