"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslations } from "next-intl";

export const description = "An area chart with gradient fill";

const chartData = [
  { month: "July", desktop: 0 },
  { month: "August", desktop: 320 },
  { month: "September", desktop: 220 },
  { month: "October", desktop: 450 },
  { month: "November", desktop: 750 },
  { month: "December", desktop: 200 },
  { month: "January", desktop: 650 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#D5020280",
  },
} satisfies ChartConfig;

export function ChartAreaGradient() {
  const t = useTranslations();
  return (
    <Card className="pt-10 pb-5  pl-0 rounded-3xl">
      <CardHeader className="sr-only ">
        <CardTitle>{t("dashboard.areaChartTitle")}</CardTitle>
        <CardDescription>{t("dashboard.areaChartDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-64 w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
            className=""
            height={100}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 800]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="#C81919"
              strokeWidth={3}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="sr-only" />
    </Card>
  );
}
