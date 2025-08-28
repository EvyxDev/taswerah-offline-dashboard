"use client";

import { PieChart, Pie, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useTranslations } from "next-intl";

type PhotoStatsNew = paymentStates2["photo_stats"];

const chartConfig = {
  print: {
    label: "Print",
    color: "#6BA3D6",
  },
  send: {
    label: "Send",
    color: "#D1D5DB",
  },
  both: {
    label: "Both",
    color: "#9CA3AF",
  },
} satisfies ChartConfig;

export function PhotoSalesChart({ photoStats }: { photoStats: PhotoStatsNew }) {
  const t = useTranslations();

  const total = photoStats?.total ?? 0;
  const hasNoData = !photoStats || total === 0;

  if (hasNoData) {
    return (
      <Card className="w-full min-w-xs mx-auto p-0 rounded-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-medium"></CardTitle>
        </CardHeader>
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            {/* Empty state text */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {t("dashboard.noPhotosTitle")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("dashboard.noPhotosDescription")}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="sr-only" />
      </Card>
    );
  }

  const chartData = [
    { name: "Print", value: photoStats.print, fill: chartConfig.print.color },
    { name: "Send", value: photoStats.send, fill: chartConfig.send.color },
    {
      name: "Both",
      value: photoStats.print_and_send,
      fill: chartConfig.both.color,
    },
  ];

  return (
    <Card className="w-full min-w-xs mx-auto p-0 rounded-3xl">
      <CardHeader className="text-center mt-7">
        <CardTitle className="text-lg font-medium sr-only">
          {t("dashboard.date")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center -mt-16 pb-4">
        <div className="relative">
          <ChartContainer config={chartConfig} className="h-80 w-80">
            <PieChart width={260} height={260}>
              <Pie
                data={chartData}
                cx={160}
                cy={160}
                innerRadius={90}
                outerRadius={115}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                stroke="none"
                strokeWidth={0}
                cornerRadius={7}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900">{total}</div>
            <div className="text-lg text-gray-600 mt-1">
              {t("payments.clients")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 -mt-7">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: chartConfig.print.color }}
            />
            <span className="text-sm font-medium font-homenaje rtl:font-almarai text-gray-700">
              {t("readyToPrint.print")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: chartConfig.send.color }}
            />
            <span className="text-sm font-medium font-homenaje rtl:font-almarai text-gray-700">
              {t("readyToPrint.sendSoftCopy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: chartConfig.both.color }}
            />
            <span className="text-sm font-medium font-homenaje rtl:font-almarai text-gray-700">
              {t("readyToPrint.both")}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="sr-only" />
    </Card>
  );
}
