import { Suspense } from "react";
import { GetAllPhotographers } from "@/lib/api/staff.api";
import EmployeesPage from "./_components/employees-page";
import { EmployeeTableSkeleton } from "./_components/employee-skeleton";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string; search?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = Math.max(1, Math.min(50, Number(searchParams.limit) || 10));
  // const search = searchParams.search; // reserved for future filter

  const photographersData = await GetAllPhotographers(page, limit);

  return (
    <Suspense fallback={<EmployeeTableSkeleton />}>
      <EmployeesPage
        PhotoGraphers={photographersData as unknown as PaginatedPhGraphers}
        pagination={{
          currentPage: page,
          totalPages: Math.max(1, photographersData.meta?.last_page),
          limit,
        }}
      />
    </Suspense>
  );
}
