import { GetPaymentsByBransh } from "@/lib/api/payments.api";
import { GetAllPhotographers } from "@/lib/api/staff.api";
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
  const fromDateParam =
    typeof searchParams?.from_date === "string"
      ? searchParams.from_date
      : Array.isArray(searchParams?.from_date)
      ? searchParams.from_date[0]
      : undefined;
  const toDateParam =
    typeof searchParams?.to_date === "string"
      ? searchParams.to_date
      : Array.isArray(searchParams?.to_date)
      ? searchParams.to_date[0]
      : undefined;
  const staffIdParam =
    typeof searchParams?.staff_id === "string"
      ? searchParams.staff_id
      : Array.isArray(searchParams?.staff_id)
      ? searchParams.staff_id[0]
      : undefined;
  const [payment, shifts, staffPage] = await Promise.all([
    GetPaymentsByBransh(shiftIdParam, fromDateParam, toDateParam, staffIdParam),
    GetShifts(),
    GetAllPhotographers(1, 1000),
  ]);
  return (
    <>
      <PaymentPage
        monthlyPayments={payment.monthly_payments}
        photoStats={payment.photo_stats}
        clients={payment.clients || []}
        shifts={shifts}
        selectedShiftId={shiftIdParam}
        fromDate={fromDateParam}
        toDate={toDateParam}
        staff={staffPage.data}
        selectedStaffId={staffIdParam}
      />
    </>
  );
}
