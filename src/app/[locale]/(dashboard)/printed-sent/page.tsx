import { GetOrdersBySendType } from "@/lib/api/barcodes";
import PrintedPage from "./_components/printed-page";
import { getAuthToken } from "@/lib/utils/auth.token";

export default async function Page() {
  const token = await getAuthToken();
  const printed = await GetOrdersBySendType(token || "", "print");
  return (
    <>
      <PrintedPage printed={printed.barcodes || []} />
    </>
  );
}
