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

interface TopMealsChartProps {
  orders: any[];
}

const TopMealsChart = ({ orders }: TopMealsChartProps) => {
  // Extract all items from delivered orders
  const mealCounts: Record<string, { name: string, count: number }> = {};
  
  orders.filter(o => o.status === "DELIVERED").forEach(order => {
    order.Items?.forEach((item: any) => {
      const mealName = item.meal?.name || "Unknown Meal";
      if (!mealCounts[mealName]) {
        mealCounts[mealName] = { name: mealName, count: 0 };
      }
      mealCounts[mealName].count += item.quantity;
    });
  });

  const data = Object.values(mealCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl">
      <CardHeader className="p-8 border-b border-border/30">
        <CardTitle className="text-xl font-black">Top Selling Meals</CardTitle>
        <CardDescription className="font-medium">Most popular items by quantity sold</CardDescription>
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
                width={100}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderRadius: '16px', 
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${1 - index * 0.15})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
            <p className="font-bold">No sales data yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopMealsChart;
