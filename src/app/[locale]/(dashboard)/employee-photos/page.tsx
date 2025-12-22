import { GetUploadedbBarcodes } from "@/lib/api/Invoice.api";
import { getAuthToken } from "@/lib/utils/auth.token";
import EmployeePhotosPage from "./_components/Page";
import { GetAllPhotographers } from "@/lib/api/staff.api";

export default async function Page() {
  const token = await getAuthToken();
  const codes = await GetUploadedbBarcodes(token || "");
  const employees = await GetAllPhotographers(1, 100);
  return (
    <>
      <EmployeePhotosPage codes={codes?.barcodes} employees={employees.data} />
    </>
  );
}
