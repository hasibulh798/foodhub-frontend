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
import { Layers } from "lucide-react";

interface CategorySalesChartProps {
  orders: any[];
}

const CategorySalesChart = ({ orders }: CategorySalesChartProps) => {
  const categoryRevenue: Record<string, number> = {};
  
  orders.forEach(order => {
    order.orderItems?.forEach((item: any) => {
      const categoryName = item.meal?.category?.name || "Other";
      categoryRevenue[categoryName] = (categoryRevenue[categoryName] || 0) + (Number(item.price) * item.quantity);
    });
  });

  const data = Object.keys(categoryRevenue)
    .map(name => ({ name, total: categoryRevenue[name] }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return (
    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl">
      <CardHeader className="p-8 border-b border-border/30">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <Layers className="text-amber-500" size={20} />
          Revenue by Category
        </CardTitle>
        <CardDescription className="font-medium">Which food categories drive most sales</CardDescription>
      </CardHeader>
      <CardContent className="p-8 h-[350px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
                tickFormatter={(value) => `৳${value}`}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderRadius: '16px', 
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Bar dataKey="total" radius={[8, 8, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${1 - index * 0.1})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
            <p className="font-bold">Insufficient data for breakdown</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySalesChart;
