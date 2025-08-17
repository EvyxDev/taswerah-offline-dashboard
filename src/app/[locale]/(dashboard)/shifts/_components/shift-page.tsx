"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { IoMdHome } from "react-icons/io";

import { useTranslations } from "next-intl";
import ShiftsTable from "./shifts-table";

type Props = {
  shifts: TShift[];
};

export default function ShiftPage({ shifts }: Props) {
  // Translation
  const t = useTranslations();

  return (
    <div className=" space-y-8 px-6 xl:px-10 py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 font-homenaje text-sm text-gray-400">
              <IoMdHome size={28} color="black" className="-mt-2" />
              {t("navigation.shifts")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="pb-10 pt-5 space-y-8">
        <h2 className="text-3xl font-homenaje  text-main-black mb-5">
          {t("shifts.title")}
        </h2>
        <ShiftsTable shifts={shifts} />
      </div>
    </div>
  );
}
