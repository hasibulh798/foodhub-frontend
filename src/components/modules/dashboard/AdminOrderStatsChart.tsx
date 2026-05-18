"use client";

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart as PieIcon } from "lucide-react";

interface AdminOrderStatsChartProps {
  orders: any[];
}

const AdminOrderStatsChart = ({ orders }: AdminOrderStatsChartProps) => {
  const statusCounts = orders.reduce((acc: any, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statusCounts).map((status) => ({
    name: status.replace(/_/g, " "),
    value: statusCounts[status],
  }));

  const COLORS = [
    "#f59e0b", // PENDING
    "#3b82f6", // CONFIRMED
    "#8b5cf6", // PREPARING
    "#f97316", // OUT_FOR_DELIVERY
    "#10b981", // DELIVERED
    "#ef4444", // CANCELLED
  ];

  return (
    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl">
      <CardHeader className="p-8 border-b border-border/30">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <PieIcon className="text-primary" size={20} />
          System-wide Order Distribution
        </CardTitle>
        <CardDescription className="font-medium">Global order status breakdown</CardDescription>
      </CardHeader>
      <CardContent className="p-8 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={8}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderRadius: '16px', 
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdminOrderStatsChart;
