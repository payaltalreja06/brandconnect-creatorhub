import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Users, TrendingUp, Shield, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { influencers, domains } from "@/data/dummy";

export default function BrandDiscover() {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [sortBy, setSortBy] = useState("followers");
  const navigate = useNavigate();

  const filtered = influencers
    .filter((inf) => {
      const matchSearch = inf.name.toLowerCase().includes(search.toLowerCase()) || inf.handle.toLowerCase().includes(search.toLowerCase());
      const matchDomain = selectedDomain === "all" || inf.domain.includes(selectedDomain);
      return matchSearch && matchDomain;
    })
    .sort((a, b) => {
      if (sortBy === "followers") return b.followers - a.followers;
      if (sortBy === "engagement") return b.engagement - a.engagement;
      if (sortBy === "health") return (b.healthScore || 0) - (a.healthScore || 0);
      return 0;
    });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Discover Influencers</h1>
        <p className="text-muted-foreground text-sm">Find the perfect creators for your campaigns</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or handle..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={selectedDomain} onValueChange={setSelectedDomain}>
          <SelectTrigger className="w-full sm:w-44">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {domains.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-44">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="followers">Followers (High → Low)</SelectItem>
            <SelectItem value="engagement">Engagement (High → Low)</SelectItem>
            <SelectItem value="health">Health Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Domain chips */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedDomain === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedDomain("all")}
        >
          All
        </Badge>
        {domains.map(d => (
          <Badge
            key={d}
            variant={selectedDomain === d ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedDomain(d)}
          >
            {d}
          </Badge>
        ))}
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inf, i) => (
          <motion.div key={inf.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/brand/influencer/${inf.id}`)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <img src={inf.avatar} alt={inf.name} className="w-12 h-12 rounded-xl bg-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold truncate">{inf.name}</h3>
                      {inf.verified && <Shield className="w-4 h-4 text-accent shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{inf.handle}</p>
                  </div>
                  {inf.healthScore && (
                    <div className="text-center shrink-0">
                      <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center">
                        <span className="text-xs font-bold">{inf.healthScore}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {inf.domain.map(d => <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>)}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-sm font-bold">{(inf.followers / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{inf.engagement}%</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{inf.rate.split("-")[0].trim()}</p>
                    <p className="text-xs text-muted-foreground">Starting</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {inf.location}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No influencers found matching your criteria</div>
      )}
    </div>
  );
}
