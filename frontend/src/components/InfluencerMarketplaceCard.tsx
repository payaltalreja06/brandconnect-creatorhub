import { Link } from "react-router-dom";
import { Heart, Star, MapPin, Instagram, Youtube } from "lucide-react";
import { type Influencer } from "@/types";
import { formatNumber } from "@/lib/formatters";
import { getAvatarUrl } from "@/lib/utils";

// TikTok icon as simple SVG since lucide doesn't have it
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.61a8.21 8.21 0 0 0 4.76 1.52v-3.44h-1z" />
    </svg>
  );
}

const badgeStyles: Record<string, string> = {
  "Top Creator":
    "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
  "Responds Fast":
    "bg-gradient-to-r from-pink-500 to-rose-500 text-white",
  UGC: "bg-gray-800 text-white",
};

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "Instagram":
      return <Instagram className="w-3 h-3" />;
    case "YouTube":
      return <Youtube className="w-3 h-3" />;
    case "TikTok":
      return <TikTokIcon className="w-3 h-3" />;
    default:
      return null;
  }
}

export default function InfluencerMarketplaceCard({
  influencer,
}: {
  influencer: Influencer;
}) {
  return (
    <Link to={`/brand/influencer/${influencer.id}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={influencer.coverImage}
            alt={influencer.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges (top-left) */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {influencer.badges.map((badge) => (
              <span
                key={badge}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold leading-none flex items-center gap-1 shadow-sm ${
                  badgeStyles[badge] || "bg-gray-700 text-white"
                }`}
              >
                {badge === "Top Creator" && (
                  <span className="text-yellow-300">⭐</span>
                )}
                {badge === "Responds Fast" && (
                  <span>⚡</span>
                )}
                {badge === "UGC" && (
                  <span className="w-3 h-3 inline-flex items-center justify-center">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5">
                      <rect x="2" y="2" width="12" height="12" rx="2" />
                    </svg>
                  </span>
                )}
                {badge}
              </span>
            ))}
          </div>

          {/* Heart Button (top-right) */}
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="w-4 h-4 text-gray-500 hover:text-pink-500 transition-colors" />
          </button>

          {/* Follower Count (bottom-right) */}
          {influencer.followers >= 1000 && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1">
              <PlatformIcon platform={influencer.platforms[0]} />
              {formatNumber(influencer.followers, 1, "million")}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5">
          {/* Name + Rating Row */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 truncate">
                {influencer.name}
              </h3>
              <div className="flex items-center gap-0.5 shrink-0">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-gray-700">
                  {influencer.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Category Description + Location */}
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 truncate">
                {influencer.domain.join(", ")} Content Creator
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-400 truncate">
                  {influencer.location}
                </span>
              </div>
            </div>
            {/* Price */}
            <span className="text-base font-bold text-gray-900 shrink-0 ml-3">
              ${influencer.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
