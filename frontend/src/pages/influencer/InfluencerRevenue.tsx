import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { revenueData, payments } from "@/data/dummy";

export default function InfluencerRevenue() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Revenue</h1>
        <p className="text-muted-foreground text-sm">Track your earnings and payment history</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Earnings", value: revenueData.totalEarnings, icon: IndianRupee },
          { label: "Completed", value: revenueData.completedPayments, icon: CheckCircle },
          { label: "Pending", value: revenueData.pendingPayments, icon: Clock },
          { label: "This Month", value: "₹2,15,000", icon: TrendingUp },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <kpi.icon className="w-4 h-4 text-muted-foreground mb-2" />
              <p className="text-xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData.monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Earnings"]} />
                <Bar dataKey="earnings" fill="hsl(173,58%,39%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue by Brand</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData.earningsByBrand} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <YAxis dataKey="brand" type="category" tick={{ fontSize: 11 }} stroke="hsl(215,16%,47%)" width={90} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="amount" fill="hsl(222,62%,18%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Payment History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Brand</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Amount</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-2.5 font-medium">{p.campaignTitle}</td>
                    <td className="py-2.5">{p.brandName}</td>
                    <td className="py-2.5 text-right font-medium">{p.amount}</td>
                    <td className="py-2.5 text-center">
                      <Badge variant={p.status === "completed" ? "default" : p.status === "pending" ? "secondary" : "outline"} className="text-xs">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground">{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
