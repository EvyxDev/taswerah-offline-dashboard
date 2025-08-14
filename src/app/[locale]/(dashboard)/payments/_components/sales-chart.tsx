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

// Props
type PhotoStats = {
  sold_percentage: number;
  sold_count: number;
  captured_count: number;
};

const chartConfig = {
  sold: {
    label: "Sold",
    color: "#6BA3D6",
  },
  captured: {
    label: "Captured",
    color: "#D1D5DB",
  },
} satisfies ChartConfig;

export function PhotoSalesChart({ photoStats }: { photoStats: PhotoStats }) {
  const t = useTranslations();

  // Check if there's no data at all
  const hasNoData =
    !photoStats ||
    (photoStats.sold_count === 0 && photoStats.captured_count === 0) ||
    (photoStats.sold_count === null && photoStats.captured_count === null) ||
    (photoStats.sold_count === undefined &&
      photoStats.captured_count === undefined);

  // If no data, show empty state
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
    {
      name: "Sold",
      value: photoStats.sold_count,
      fill: chartConfig.sold.color,
    },
    { name: "Gap1", value: 3, fill: "transparent" },
    {
      name: "Captured",
      value: photoStats.captured_count,
      fill: chartConfig.captured.color,
    },
    { name: "Gap2", value: 3, fill: "transparent" },
  ];

  return (
    <Card className="w-full min-w-xs mx-auto p-0 rounded-3xl">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-medium">
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
            <div className="text-4xl font-bold text-gray-900">
              {photoStats.sold_percentage}%
            </div>
            <div className="text-lg text-gray-600 mt-1">
              {t("dashboard.soldPhotos")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 -mt-7">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#6BA3D6]" />
            <span className="text-sm font-medium font-homenaje text-gray-700">
              {t("dashboard.sold")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#D1D5DB]" />
            <span className="text-sm font-medium font-homenaje text-gray-700">
              {t("dashboard.captured")}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="sr-only" />
    </Card>
  );
}
