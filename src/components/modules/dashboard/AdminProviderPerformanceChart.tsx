"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award } from "lucide-react";

interface AdminProviderPerformanceChartProps {
  orders: any[];
}

const AdminProviderPerformanceChart = ({ orders }: AdminProviderPerformanceChartProps) => {
  const providerSales: Record<string, { name: string, total: number }> = {};
  
  orders.filter(o => o.status === "DELIVERED").forEach(order => {
    const businessName = order.provider?.businessName || "Unknown Provider";
    if (!providerSales[businessName]) {
      providerSales[businessName] = { name: businessName, total: 0 };
    }
    providerSales[businessName].total += Number(order.totalAmount);
  });

  const data = Object.values(providerSales)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl">
      <CardHeader className="p-8 border-b border-border/30">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <Award className="text-amber-500" size={20} />
          Top Performing Providers
        </CardTitle>
        <CardDescription className="font-medium">Merchants with highest gross revenue</CardDescription>
      </CardHeader>
      <CardContent className="p-8 h-[350px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
                width={120}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderRadius: '16px', 
                  border: '1px solid hsl(var(--border))',
                }}
                formatter={(value) => `৳${Number(value).toLocaleString()}`}
              />
              <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${1 - index * 0.15})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
            <p className="font-bold">No performance data yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProviderPerformanceChart;
