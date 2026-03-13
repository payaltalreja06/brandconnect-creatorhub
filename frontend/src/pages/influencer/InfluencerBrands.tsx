import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Globe, Megaphone } from "lucide-react";
import { brands } from "@/data/dummy";
import { toast } from "sonner";

export default function InfluencerBrands() {
  const [search, setSearch] = useState("");
  const filtered = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.domain.toLowerCase().includes(search.toLowerCase()) ||
    b.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Browse Brands</h1>
        <p className="text-muted-foreground text-sm">Discover brands and send collaboration requests</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search brands by name, domain or industry..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <Card key={b.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-4xl">{b.logo}</span>
                <div>
                  <h3 className="font-semibold text-lg">{b.name}</h3>
                  <Badge variant="secondary" className="text-xs mt-1">{b.industry}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{b.description}</p>
              <div className="space-y-1 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" />{b.website}</div>
                <div className="flex items-center gap-2"><Megaphone className="w-3.5 h-3.5" />{b.campaigns} campaigns</div>
                <div className="flex items-center gap-2">💰 Budget: {b.budget}</div>
              </div>
              <Button className="w-full gap-2" size="sm" onClick={() => toast.success(`Request sent to ${b.name}!`)}>
                <Send className="w-3.5 h-3.5" /> Send Request
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
