"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCompactNumber } from "@/lib/formatters";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export function ViewsByPurchasingPowerPrice({
  chartData,
}: {
  chartData: {
    pppName: string;
    views: number;
  }[];
}) {
  const chartConfig = {
    views: {
      label: "Visitors",
      color: "hsl(var(--accent))",
    },
  };

  if (chartData.length === 0) {
    return (
      <p className="flex max-h-[250px] min-h-[150px] items-center justify-center text-muted-foreground">
        No data available
      </p>
    );
  }

  const data = chartData.map((d) => ({
    ...d,
    pppName: d.pppName.replace("Parity Group: ", ""),
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[250px] min-h-[150px] w-full"
    >
      <BarChart accessibilityLayer data={data}>
        <XAxis dataKey="pppName" tickLine={false} tickMargin={10} />
        <YAxis
          tickLine={false}
          tickMargin={10}
          allowDecimals={false}
          tickFormatter={formatCompactNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="views" fill="var(--color-views)" />
      </BarChart>
    </ChartContainer>
  );
}
