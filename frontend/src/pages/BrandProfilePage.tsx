import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Globe, Send, Megaphone, Target, CheckCircle } from "lucide-react";
const brands: any[] = [];

export default function BrandProfilePage() {
  const { id } = useParams();
  const brand = brands.find((b) => b.id === id);

  if (!brand) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Brand not found</h2>
        <Link to="/influencer/brands">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Brands</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/influencer/brands">
          <Button variant="ghost" size="icon">
             <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Brand Profile
          </h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Essential Details */}
        <div className="md:col-span-1 space-y-6">
          <Card>
             <CardContent className="p-6 text-center">
               <div className="text-6xl mb-4 flex justify-center">{brand.logo}</div>
               <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                 {brand.name} <CheckCircle className="w-5 h-5 text-blue-500" />
               </h2>
               <p className="text-sm text-muted-foreground mt-1 mb-4">{brand.domain}</p>
               <Badge className="mb-6">{brand.industry}</Badge>
               
               <div className="flex gap-2 justify-center">
                 <Link to="/influencer/messages" className="w-full">
                   <Button className="w-full gap-2 bg-gradient-to-r from-pink-500 to-rose-500 border-0 text-white">
                     <Send className="w-4 h-4" /> Message
                   </Button>
                 </Link>
               </div>
             </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-2">Company Info</h3>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <a href={`https://${brand.website}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{brand.website}</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Megaphone className="w-4 h-4 text-muted-foreground" />
                <span>{brand.campaigns} Active Campaigns</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span>Budget: {brand.budget}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Overview & FAQ */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl mb-4">About {brand.name}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {brand.description} We are actively looking for long-term creator partnerships in the {brand.industry} space. 
                Our team values high-quality, authentic storytelling that resonates with your core audience.
              </p>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <h4 className="font-semibold mb-2">Preferred Creator Stats</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Minimum 10k followers on primary platform</li>
                  <li>At least 2% engagement rate</li>
                  <li>Audience primarily based in US/UK/CA</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {brand.faqs && brand.faqs.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-4">Brand FAQ</h3>
                <div className="space-y-4 border-t border-gray-100 pt-4">
                  {brand.faqs.map((faq, i) => (
                    <div key={i}>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">{faq.question}</h4>
                      <p className="text-sm text-gray-500">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
