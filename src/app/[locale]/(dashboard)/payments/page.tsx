import { GetPaymentsByBransh } from "@/lib/api/payments.api";
import PaymentPage from "./_components/payment-page";
import { GetClentsByBranch } from "@/lib/api/client.api";

export default async function Page() {
  const payment = await GetPaymentsByBransh();
  const clients = await GetClentsByBranch();

  return (
    <>
      <PaymentPage
        SalesChart={payment?.sales_data}
        photoStats={payment?.photo_distribution}
        clients={clients.data}
      />
    </>
  );
}
