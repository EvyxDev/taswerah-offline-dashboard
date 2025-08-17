import { ChartAreaGradient } from "./payment-area-gradient";
import { PhotoSalesChart } from "./sales-chart";

export default function ChartsSectoin({
  monthlyPayments,
  photoStats,
}: {
  monthlyPayments: paymentStates2["monthly_payments"];
  photoStats: paymentStates2["photo_stats"];
}) {
  console.log(photoStats);
  console.log(monthlyPayments);
  return (
    <div className="flex items-start min-[1100px]:flex-row flex-col justify-between gap-2 flex-wrap">
      <div className=" w-full min-[1100px]:w-[60%]">
        <ChartAreaGradient monthlyPayments={monthlyPayments} />
      </div>
      <div className="w-full min-[1100px]:w-[38%]">
        <PhotoSalesChart photoStats={photoStats} />
      </div>
    </div>
  );
}
