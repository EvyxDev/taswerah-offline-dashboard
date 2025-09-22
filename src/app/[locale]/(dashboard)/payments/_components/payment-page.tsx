import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import DashTable from "./payment-table";
import { useTranslations } from "next-intl";
import ChartsSectoin from "./charts-sectoin";
import { IoMdHome } from "react-icons/io";
import ExportDialog from "./export-dialog";
import FilterDialog from "./filter-dialog";
import SyncStatus from "./sync-status";
import SyncFilterDialog from "./sync-filter-dialog";

export default function PaymentPage({
  monthlyPayments,
  photoStats,
  clients,
  shifts,
  selectedShiftId,
  fromDate,
  toDate,
  staff,
  selectedStaffId,
}: {
  monthlyPayments: paymentStates2["monthly_payments"];
  photoStats: paymentStates2["photo_stats"];
  clients: Client[];
  shifts: TShift[];
  selectedShiftId?: string;
  fromDate?: string;
  toDate?: string;
  staff: Employee[];
  selectedStaffId?: string;
}) {
  const t = useTranslations("payments");
  return (
    <div className=" space-y-8 px-6 xl:px-10 py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 font-homenaje rtl:font-almarai text-sm text-gray-400">
              <IoMdHome size={28} color="black" className="-mt-2" />{" "}
              {t("breadcrumb")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="pb-10 pt-5 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-homenaje rtl:font-almarai  text-main-black mb-5">
            {t("title")}
          </h2>
          <div className="flex items-center gap-3">
            <FilterDialog
              shifts={shifts}
              selectedShiftId={selectedShiftId}
              fromDate={fromDate}
              toDate={toDate}
              staff={staff}
              selectedStaffId={selectedStaffId}
            />
            <ExportDialog />
            <SyncFilterDialog staff={staff} />
          </div>
        </div>

        {/* Sync Status Component */}
        <div className="mb-6">
          <SyncStatus />
        </div>

        <ChartsSectoin
          monthlyPayments={monthlyPayments}
          photoStats={photoStats}
        />
        <DashTable clients={clients} />
      </div>
    </div>
  );
}
