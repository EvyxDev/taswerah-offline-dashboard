import { Suspense } from "react";
import { GetShifts } from "@/lib/api/shifts.api";
import { EmployeeTableSkeleton } from "./_components/employee-skeleton";
import ShiftPage from "./_components/shift-page";

export default async function Page() {
  const shifts = await GetShifts();

  return (
    <Suspense fallback={<EmployeeTableSkeleton />}>
      <ShiftPage shifts={shifts} />
    </Suspense>
  );
}
