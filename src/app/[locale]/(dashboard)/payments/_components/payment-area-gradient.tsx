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

type MonthlyPayment = { month: string; value: number };

type MonthlyPayments = MonthlyPayment[];

const chartConfig = {
  desktop: {
    label: "Payment",
    color: "#D5020280",
  },
} satisfies ChartConfig;

export function ChartAreaGradient({
  monthlyPayments,
}: {
  monthlyPayments: MonthlyPayments;
}) {
  const t = useTranslations();

  // Check if there's no data at all
  const hasNoData =
    !monthlyPayments ||
    monthlyPayments.length === 0 ||
    monthlyPayments.every((entry) => !entry.value || entry.value === 0);

  // If no data, show empty state
  if (hasNoData) {
    return (
      <Card className="pt-10 pl-0 rounded-3xl  pb-3 w-full">
        <CardContent className="flex flex-col items-center justify-center h-80 text-center">
          <div className="text-gray-400 space-y-4">
            {/* Empty state icon */}
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            {/* Empty state text */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {t("dashboard.noDataTitle")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("dashboard.noDataDescription")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = monthlyPayments.map((entry) => ({
    month: entry.month,
    desktop: entry.value ?? 0,
  }));

  return (
    <Card className="pt-10 pb-5 pl-0 rounded-3xl w-full">
      <CardHeader className="sr-only">
        <CardTitle>{t("dashboard.areaChartTitle")}</CardTitle>
        <CardDescription>{t("dashboard.areaChartDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-96 w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
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
              domain={[
                0,
                Math.max(800, ...monthlyPayments.map((e) => e.value || 0)),
              ]}
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
