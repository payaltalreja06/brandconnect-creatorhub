import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, CheckCircle, Clock } from "lucide-react";
import { payments } from "@/data/dummy";

export default function BrandPayments() {
  const total = "₹15,60,000";
  const completed = payments.filter(p => p.status === "completed").length;
  const pending = payments.filter(p => p.status === "pending" || p.status === "processing").length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground text-sm">Manage campaign payments and billing</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-4"><IndianRupee className="w-4 h-4 text-muted-foreground mb-2" /><p className="text-xl font-bold">{total}</p><p className="text-xs text-muted-foreground">Total Spending</p></CardContent></Card>
        <Card><CardContent className="p-4"><CheckCircle className="w-4 h-4 text-muted-foreground mb-2" /><p className="text-xl font-bold">{completed}</p><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
        <Card><CardContent className="p-4"><Clock className="w-4 h-4 text-muted-foreground mb-2" /><p className="text-xl font-bold">{pending}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Payment History</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium text-muted-foreground">Campaign</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Influencer</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Amount</th>
                <th className="text-center py-2 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="py-2.5 font-medium">{p.campaignTitle}</td>
                  <td className="py-2.5">{p.influencerName}</td>
                  <td className="py-2.5 text-right font-medium">{p.amount}</td>
                  <td className="py-2.5 text-center">
                    <Badge variant={p.status === "completed" ? "default" : "secondary"} className="text-xs">{p.status}</Badge>
                  </td>
                  <td className="py-2.5 text-right text-muted-foreground">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
