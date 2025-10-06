import { ChartAreaGradient } from "./payment-area-gradient";

export default function ChartsSectoin({
  monthlyPayments,
}: {
  monthlyPayments: paymentStates2["monthly_payments"];
  photoStats: paymentStates2["photo_stats"];
}) {
  return (
    <div className="flex w-full ">
      <ChartAreaGradient monthlyPayments={monthlyPayments} />
    </div>
  );
}
