import { GetAllPhotographers } from "@/lib/api/staff.api";
import HomePage from "./_components/home-page";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = Math.max(1, Math.min(50, Number(searchParams.limit) || 10));

  const Photographers = await GetAllPhotographers(page, limit);
  if (!Photographers) {
    return;
  }
  return (
    <>
      <HomePage
        PhotoGraphers={Photographers.data}
        pagination={{
          currentPage: page,
          totalPages: [Math.max(1, Photographers?.meta?.last_page) || 10],
          limit,
        }}
      />
    </>
  );
}
