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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  success: {
    label: "Successful",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export default function ExecutionStatusChart({
  data,
}: {
  data: { date: string; success: number; failed: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Workflow execution status</CardTitle>
        <CardDescription>
          Daily executions breakdown for this period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={data} height={200} accessibilityLayer>
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
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <Area
              type="bump"
              dataKey="success"
              stroke="var(--color-success)"
              fill="var(--color-success)"
              fillOpacity={0.3}
              stackId="a"
            />
            <Area
              type="bump"
              dataKey="failed"
              stroke="var(--color-failed)"
              fill="var(--color-failed)"
              fillOpacity={0.3}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
