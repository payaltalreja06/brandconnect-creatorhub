import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import PublicNavbar from "@/components/PublicNavbar";
import FilterSidebar, {
  type FilterState,
  defaultFilters,
} from "@/components/FilterSidebar";
import InfluencerMarketplaceCard from "@/components/InfluencerMarketplaceCard";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import { influencerApi } from "@/lib/api";
import { type Influencer } from "@/types";

function matchFollowers(followers: number, range: string): boolean {
  switch (range) {
    case "1k-10k":
      return followers >= 1_000 && followers < 10_000;
    case "10k-50k":
      return followers >= 10_000 && followers < 50_000;
    case "50k-500k":
      return followers >= 50_000 && followers < 500_000;
    case "500k-1m":
      return followers >= 500_000 && followers < 1_000_000;
    case "1m+":
      return followers >= 1_000_000;
    default:
      return true;
  }
}

function matchPrice(price: number, range: string): boolean {
  switch (range) {
    case "0-50":
      return price <= 50;
    case "50-100":
      return price > 50 && price <= 100;
    case "100-250":
      return price > 100 && price <= 250;
    case "250-500":
      return price > 250 && price <= 500;
    case "500+":
      return price > 500;
    default:
      return true;
  }
}

function matchLocation(location: string, filter: string): boolean {
  const loc = location.toLowerCase();
  switch (filter) {
    case "United States":
      return loc.includes("us") || loc.includes("united states") || loc.includes("ca, us") || loc.includes("fl, us");
    case "United Kingdom":
      return loc.includes("gb") || loc.includes("uk") || loc.includes("london");
    case "Canada":
      return loc.includes("ca") && !loc.includes("us");
    case "India":
      return loc.includes("india");
    case "UAE":
      return loc.includes("uae") || loc.includes("dubai");
    case "Spain":
      return loc.includes("spain") || loc.includes("barcelona");
    default:
      return true;
  }
}

export default function InfluencersPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const fetchInfluencers = async () => {
      setLoading(true);
      try {
        const res = await influencerApi.getAll();
        setInfluencers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch influencers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfluencers();
  }, []);

  const filtered = useMemo(() => {
    return influencers.filter((inf) => {
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          inf.name?.toLowerCase().includes(q) ||
          inf.handle?.toLowerCase().includes(q) ||
          inf.domain?.some((d) => d.toLowerCase().includes(q)) ||
          inf.bio?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Platform
      if (
        filters.platform !== "any" &&
        !inf.platforms?.includes(filters.platform)
      )
        return false;

      // Content Type
      if (
        filters.contentType !== "any" &&
        !inf.contentType?.includes(filters.contentType)
      )
        return false;

      // Followers
      if (filters.followers !== "any" && !matchFollowers(inf.followers || 0, filters.followers))
        return false;

      // Price
      if (filters.price !== "any" && !matchPrice(inf.price || 0, filters.price))
        return false;

      // Gender
      if (filters.gender !== "any" && inf.gender !== filters.gender)
        return false;

      return true;
    });
  }, [influencers, filters, searchQuery]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen bg-gray-50/30">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />

        {/* Results Header */}
        <div className="mt-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Influencers</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} influencer{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visible.map((inf, i) => (
            <motion.div
              key={inf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <InfluencerMarketplaceCard influencer={inf} />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No influencers found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-10 mb-6">
            <button
              onClick={() => setVisibleCount((c) => c + 8)}
              className="px-8 py-3 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </main>

      <MarketplaceFooter />
    </div>
  );
}
