"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCompactNumber } from "@/lib/formatters";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export default function ViewsByCountryChart({
  chartData,
}: {
  chartData: {
    countryCode: string;
    countryName: string;
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
      <p className="flex max-h-[250px] min-h-[150px] items-center justify-center text-center text-muted-foreground">
        No Data Available
      </p>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[250px] min-h-[150px] w-full"
    >
      <BarChart accessibilityLayer data={chartData}>
        <XAxis dataKey={"countryCode"} tickLine={false} tickMargin={10} />
        <YAxis
          tickLine={false}
          tickMargin={10}
          allowDecimals={false}
          tickFormatter={formatCompactNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey={"views"} fill="var(--color-views)" />
      </BarChart>
    </ChartContainer>
  );
}
