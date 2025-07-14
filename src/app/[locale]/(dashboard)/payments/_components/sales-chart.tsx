"use client";

import { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export const description =
  "A donut chart showing photo sales progress with data filter";

// Type definitions
interface SalesData {
  sold: number;
  captured: number;
}

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

type SalesDataMap = Record<string, SalesData>;

// Fake data for different dates
const salesData: SalesDataMap = {
  "2025-02-20": { sold: 60, captured: 34 },
  "2025-02-19": { sold: 45, captured: 52 },
  "2025-02-18": { sold: 78, captured: 19 },
  "2025-02-17": { sold: 32, captured: 65 },
  "2025-02-16": { sold: 89, captured: 8 },
  "2025-02-15": { sold: 67, captured: 28 },
  "2025-02-14": { sold: 54, captured: 41 },
  "2025-02-13": { sold: 73, captured: 22 },
  "2025-02-12": { sold: 41, captured: 56 },
  "2025-02-11": { sold: 85, captured: 12 },
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

export function PhotoSalesChart(): JSX.Element {
  const t = useTranslations();
  const [selectedDate, setSelectedDate] = useState<string>("2025-02-20");

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const currentData: SalesData = salesData[selectedDate];
  const total: number = currentData.sold + currentData.captured;
  const soldPercentage: number = Math.round((currentData.sold / total) * 100);

  const chartData: ChartDataItem[] = [
    { name: "Sold", value: currentData.sold, fill: "#6BA3D6" },
    { name: "Gap1", value: 3, fill: "transparent" },
    { name: "Captured", value: currentData.captured, fill: "#D1D5DB" },
    { name: "Gap2", value: 3, fill: "transparent" },
  ];

  return (
    <Card className="w-full min-w-xs mx-auto p-0 rounded-3xl">
      <CardHeader className="text-center ">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center justify-end gap-2">
            <span>{t("dashboard.date")}:</span>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-fit border-0 bg-transparent p-0 h-auto shadow-none hover:bg-gray-50 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(salesData).map((date: string) => (
                  <SelectItem key={date} value={date}>
                    {formatDate(date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center -mt-16 pb-4 ">
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
                {chartData.map((entry: ChartDataItem, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900">
              {soldPercentage}%
            </div>
            <div className="text-lg text-gray-600 mt-1">
              {t("dashboard.soldPhotos")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 -mt-7">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#6BA3D6]"></div>
            <span className="text-sm font-medium font-homenaje text-gray-700">
              {t("dashboard.sold")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#D1D5DB]"></div>
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
