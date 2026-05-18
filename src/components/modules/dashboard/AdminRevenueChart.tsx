"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface AdminRevenueChartProps {
  orders: any[];
}

const AdminRevenueChart = ({ orders }: AdminRevenueChartProps) => {
  // Process last 7 days of revenue
  const last7Days = [...Array(7)].map((_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: format(date, "MMM dd"),
      fullDate: startOfDay(date),
      revenue: 0,
    };
  }).reverse();

  orders.forEach((order) => {
    if (order.status === "DELIVERED") {
      const orderDate = startOfDay(new Date(order.createdAt));
      const dayData = last7Days.find(d => d.fullDate.getTime() === orderDate.getTime());
      if (dayData) {
        dayData.revenue += Number(order.totalAmount);
      }
    }
  });

  return (
    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl">
      <CardHeader className="p-8 border-b border-border/30">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <TrendingUp className="text-emerald-500" size={20} />
          Platform Revenue
        </CardTitle>
        <CardDescription className="font-medium">System-wide earnings trend (Last 7 days)</CardDescription>
      </CardHeader>
      <CardContent className="p-8 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={last7Days}>
            <defs>
              <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
              tickFormatter={(value) => `৳${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderRadius: '16px', 
                border: '1px solid hsl(var(--border))',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#adminRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdminRevenueChart;
