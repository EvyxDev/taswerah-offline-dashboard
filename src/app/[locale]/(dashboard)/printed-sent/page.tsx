import { GetPrintedCodes } from "@/lib/api/barcodes";
import PrintedPage from "./_components/printed-page";
import { getAuthToken } from "@/lib/utils/auth.token";

export default async function Page() {
  const token = await getAuthToken();
  const Printed = await GetPrintedCodes(token || "");
  return (
    <>
      <PrintedPage Printed={Printed.barcodes} />
    </>
  );
}
