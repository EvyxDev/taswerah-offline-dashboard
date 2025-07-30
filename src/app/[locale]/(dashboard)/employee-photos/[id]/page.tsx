import { GetUploadedbBarcodes } from "@/lib/api/Invoice.api";
import { getAuthToken } from "@/lib/utils/auth.token";
import EmployeePhotosPage from "../_components/Page";

interface EmployeePhotosPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    name?: string;
  }>;
}

export default async function Page({
  params,
  searchParams,
}: EmployeePhotosPageProps) {
  const token = await getAuthToken();
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const employeeId = resolvedParams.id;
  const employeeName = resolvedSearchParams.name;
  const codes = await GetUploadedbBarcodes(token || "", employeeId);

  return (
    <>
      <EmployeePhotosPage
        employeeName={employeeName || ""}
        codes={codes.barcodes}
      />
    </>
  );
}
