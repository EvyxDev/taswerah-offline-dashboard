import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import DashTable from "./payment-table";
import { useTranslations } from "next-intl";
import ChartsSectoin from "./charts-sectoin";

export default function PaymentPage() {
  const t = useTranslations("payments");
  return (
    <div className=" space-y-8 px-6 xl:px-10 py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 font-homenaje text-sm text-gray-400">
              {t("breadcrumb")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="pb-10 pt-5 space-y-8">
        <h2 className="text-3xl font-homenaje  text-main-black mb-5">
          {t("title")}
        </h2>
        <ChartsSectoin />
        <DashTable />
      </div>
    </div>
  );
}
