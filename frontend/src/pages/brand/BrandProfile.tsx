import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Globe, Mail, Edit } from "lucide-react";
import { brands } from "@/data/dummy";

export default function BrandProfile() {
  const brand = brands[0]; // Current brand

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your brand information</p>
        </div>
        <Button variant="outline" className="gap-2"><Edit className="w-4 h-4" /> Edit</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <span className="text-5xl">{brand.logo}</span>
            <div>
              <h2 className="text-xl font-bold">{brand.name}</h2>
              <p className="text-muted-foreground text-sm">{brand.industry}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" />{brand.website}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{brand.contactEmail}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Company Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Industry</span><span className="font-medium">{brand.industry}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Budget Range</span><span className="font-medium">{brand.budget}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Campaigns</span><span className="font-medium">{brand.campaigns}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Domain</span><span className="font-medium">{brand.domain}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">About</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{brand.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
