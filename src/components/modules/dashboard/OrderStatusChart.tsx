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

interface OrderStatusChartProps {
  orders: any[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  CONFIRMED: "#3b82f6",
  PREPARING: "#a855f7",
  OUT_FOR_DELIVERY: "#f97316",
  DELIVERED: "#10b981",
  CANCELLED: "#f43f5e",
};

const OrderStatusChart = ({ orders }: OrderStatusChartProps) => {
  const data = Object.keys(STATUS_COLORS).map(status => ({
    name: status.replace(/_/g, " "),
    value: orders.filter(o => o.status === status).length
  })).filter(d => d.value > 0);

  return (
    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl">
      <CardHeader className="p-8 border-b border-border/30">
        <CardTitle className="text-xl font-black">Order Status</CardTitle>
        <CardDescription className="font-medium">Distribution of orders by current state</CardDescription>
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
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name.replace(/ /g, "_")]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderRadius: '16px', 
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OrderStatusChart;
