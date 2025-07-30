import { getAuthToken } from "@/lib/utils/auth.token";
import OrderPage from "./_components/order-page";
import { GetAllInvoices } from "@/lib/api/Invoice.api";

export default async function Page() {
  const token = await getAuthToken();
  const invoices = await GetAllInvoices(token || "");
  return (
    <>
      <OrderPage invoices={invoices} />
    </>
  );
}
