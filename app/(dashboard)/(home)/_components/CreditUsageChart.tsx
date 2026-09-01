"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  success: {
    label: "Successful phases",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed phases",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export default function CreditUsageChart({
  data,
}: {
  data: { date: string; success: number; failed: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Credit consumed</CardTitle>
        <CardDescription>
          Daily credit usage breakdown for this period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => format(new Date(value), "MMM dd")}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="success"
              fill="var(--color-success)"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="failed"
              fill="var(--color-failed)"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
