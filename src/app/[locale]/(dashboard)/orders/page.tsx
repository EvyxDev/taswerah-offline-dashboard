import { getAuthToken } from "@/lib/utils/auth.token";
import OrderPage from "./_components/order-page";
import { GetAllOrders } from "@/lib/api/Invoice.api";
import { GetAllPhotographers } from "@/lib/api/staff.api";
import { GetShifts } from "@/lib/api/shifts.api";

export default async function Page() {
  const token = await getAuthToken();
  const Orders = await GetAllOrders(token || "");
  const photographers = await GetAllPhotographers(1, 1000);
  const shifts = await GetShifts();
  return (
    <>
      <OrderPage
        employees={photographers.data}
        orders={Orders.data}
        shifts={shifts}
      />
    </>
  );
}
