import { GetUserBarcodes } from "@/lib/api/barcodes";
import BarcodesPage from "./_components/barcodes-page";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string; filter?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = Math.max(10);
  const rawFilter = (searchParams.filter || "").toLowerCase();
  const filter =
    rawFilter === "yes" || rawFilter === "no" ? rawFilter : undefined;

  const barcodesData = await GetUserBarcodes(
    page,
    limit,
    filter as undefined | "yes" | "no"
  );

  return (
    <BarcodesPage
      barcodes={barcodesData}
      pagination={{
        currentPage: page,
        totalPages: Math.max(1, barcodesData.last_page),
        limit,
      }}
      filter={filter}
    />
  );
}
