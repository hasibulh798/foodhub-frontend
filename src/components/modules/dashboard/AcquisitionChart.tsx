"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

interface AcquisitionChartProps {
  users: any[];
  providers: any[];
}

const AcquisitionChart = ({ users, providers }: AcquisitionChartProps) => {
  // Process last 6 months of growth
  const last6Months = [...Array(6)].map((_, i) => {
    const date = subMonths(new Date(), i);
    return {
      month: format(date, "MMM"),
      fullDate: startOfMonth(date),
      userCount: 0,
      providerCount: 0,
    };
  }).reverse();

  users.forEach((user) => {
    const userDate = startOfMonth(new Date(user.createdAt));
    const monthData = last6Months.find(m => m.fullDate.getTime() === userDate.getTime());
    if (monthData) monthData.userCount++;
  });

  providers.forEach((provider) => {
    const providerDate = startOfMonth(new Date(provider.createdAt));
    const monthData = last6Months.find(m => m.fullDate.getTime() === providerDate.getTime());
    if (monthData) monthData.providerCount++;
  });

  return (
    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl">
      <CardHeader className="p-8 border-b border-border/30">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <Users className="text-blue-500" size={20} />
          Growth Analytics
        </CardTitle>
        <CardDescription className="font-medium">Monthly acquisition of users vs providers</CardDescription>
      </CardHeader>
      <CardContent className="p-8 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={last6Months}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderRadius: '16px', 
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Legend verticalAlign="top" align="right" height={36} />
            <Line 
              type="monotone" 
              dataKey="userCount" 
              name="New Customers"
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="providerCount" 
              name="New Providers"
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AcquisitionChart;
