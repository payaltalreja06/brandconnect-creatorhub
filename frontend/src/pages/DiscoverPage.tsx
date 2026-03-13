import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Users, TrendingUp, BadgeCheck, Youtube, Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { influencers, domains, type Influencer } from "@/data/dummy";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

function InfluencerCard({ inf }: { inf: Influencer }) {
  return (
    <Link to={`/influencer/${inf.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <img src={inf.avatar} alt={inf.name} className="w-14 h-14 rounded-full bg-muted" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{inf.name}</h3>
                {inf.verified && <BadgeCheck className="w-4 h-4 text-accent shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground truncate">{inf.handle}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {inf.domain.map((d) => (
                  <Badge key={d} variant="secondary" className="text-xs font-normal">{d}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Users className="w-3.5 h-3.5" />
              </div>
              <p className="font-semibold text-sm">{formatNumber(inf.followers)}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <p className="font-semibold text-sm">{inf.engagement}%</p>
              <p className="text-xs text-muted-foreground">Engagement</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                {inf.platforms.includes("YouTube") ? <Youtube className="w-3.5 h-3.5" /> : <Instagram className="w-3.5 h-3.5" />}
              </div>
              <p className="font-semibold text-sm">{inf.platforms.length}</p>
              <p className="text-xs text-muted-foreground">Platforms</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full mt-4 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors">
            View Profile
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("followers");

  const filtered = useMemo(() => {
    let result = [...influencers];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q) || i.handle.toLowerCase().includes(q));
    }
    if (selectedDomain !== "all") {
      result = result.filter((i) => i.domain.includes(selectedDomain));
    }
    if (sortBy === "followers") result.sort((a, b) => b.followers - a.followers);
    else if (sortBy === "engagement") result.sort((a, b) => b.engagement - a.engagement);
    return result;
  }, [search, selectedDomain, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-1">Discover Influencers</h1>
        <p className="text-muted-foreground mb-8">Find the perfect creator for your brand campaign</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedDomain} onValueChange={setSelectedDomain}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Domains" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {domains.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <ChevronDown className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="followers">Most Followers</SelectItem>
            <SelectItem value="engagement">Highest Engagement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Domain Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Badge
          variant={selectedDomain === "all" ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => setSelectedDomain("all")}
        >
          All
        </Badge>
        {domains.slice(0, 8).map((d) => (
          <Badge
            key={d}
            variant={selectedDomain === d ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setSelectedDomain(d)}
          >
            {d}
          </Badge>
        ))}
      </div>

      {/* Results */}
      <p className="text-sm text-muted-foreground mb-4">{filtered.length} influencer{filtered.length !== 1 ? "s" : ""} found</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((inf, i) => (
          <motion.div
            key={inf.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <InfluencerCard inf={inf} />
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No influencers found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
