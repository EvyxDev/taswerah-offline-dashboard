import { GetReadyToPrintCodes } from "@/lib/api/Invoice.api";
import ReadyToPrintPage from "./_components/ready-to-print-page";
import { getAuthToken } from "@/lib/utils/auth.token";

export default async function Page() {
  const token = await getAuthToken();

  const data = await GetReadyToPrintCodes(token || "");
  return (
    <>
      <ReadyToPrintPage barcodes={data.barcodes} />
    </>
  );
}
