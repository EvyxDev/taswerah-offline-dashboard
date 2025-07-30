import { ChartAreaGradient } from "./payment-area-gradient";
import { PhotoSalesChart } from "./sales-chart";

export default function ChartsSectoin({
  SalesChart,
  photoStats,
}: {
  SalesChart: SalesChart;
  photoStats: PhotoStats;
}) {
  return (
    <div className="flex items-start min-[1100px]:flex-row flex-col justify-between gap-2 flex-wrap">
      <div className=" w-full min-[1100px]:w-[60%]">
        <ChartAreaGradient SalesChart={SalesChart} />
      </div>
      <div className="w-full min-[1100px]:w-[38%]">
        <PhotoSalesChart photoStats={photoStats} />
      </div>
    </div>
  );
}
