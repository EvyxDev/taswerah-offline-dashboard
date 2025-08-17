import { GetPaymentsByBransh } from "@/lib/api/payments.api";
import PaymentPage from "./_components/payment-page";
import { GetShifts } from "@/lib/api/shifts.api";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const shiftIdParam =
    typeof searchParams?.shift_id === "string"
      ? searchParams.shift_id
      : Array.isArray(searchParams?.shift_id)
      ? searchParams.shift_id[0]
      : undefined;
  const [payment, shifts] = await Promise.all([
    GetPaymentsByBransh(shiftIdParam),
    GetShifts(),
  ]);
  return (
    <>
      <PaymentPage
        monthlyPayments={payment.monthly_payments}
        photoStats={payment.photo_stats}
        clients={payment.clients || []}
        shifts={shifts}
        selectedShiftId={shiftIdParam}
      />
    </>
  );
}
