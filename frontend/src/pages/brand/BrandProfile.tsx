import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Globe, Mail, Edit, Plus, Trash } from "lucide-react";
import { brands, FAQ } from "@/data/dummy";

export default function BrandProfile() {
  const brand = brands[0]; // Current brand
  const [faqs, setFaqs] = useState<FAQ[]>(brand.faqs || []);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const handleAddFaq = () => {
    if (!newFaqQ || !newFaqA) return;
    setFaqs([...faqs, { question: newFaqQ, answer: newFaqA }]);
    setNewFaqQ("");
    setNewFaqA("");
    setIsFaqOpen(false);
  };
  
  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Company FAQs</CardTitle>
          <Dialog open={isFaqOpen} onOpenChange={setIsFaqOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1"><Plus className="w-3 h-3" /> Add FAQ</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add FAQ</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question</label>
                  <Input value={newFaqQ} onChange={e => setNewFaqQ(e.target.value)} placeholder="e.g. Do you provide free products?" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Answer</label>
                  <Textarea value={newFaqA} onChange={e => setNewFaqA(e.target.value)} placeholder="e.g. Yes..." rows={3} />
                </div>
                <Button className="w-full" onClick={handleAddFaq}>Add FAQ</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.length === 0 && <p className="text-sm text-muted-foreground">No FAQs added yet.</p>}
          {faqs.map((faq, i) => (
            <div key={i} className="group relative border rounded-lg p-3 text-sm">
              <Button variant="ghost" size="icon" onClick={() => handleRemoveFaq(i)} className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash className="w-3 h-3" />
              </Button>
              <p className="font-semibold mb-1 pr-6">{faq.question}</p>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
