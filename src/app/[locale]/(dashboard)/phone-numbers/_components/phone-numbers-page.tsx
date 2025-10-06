"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { IoMdHome } from "react-icons/io";

import { useTranslations } from "next-intl";

import PhoneNumbersTable from "./phone-numbers-table";

type Props = {
  phoneNumbers: string[];
};

export default function PhoneNumbersPage({ phoneNumbers }: Props) {
  const t = useTranslations("phoneNumbers");

  return (
    <div className=" space-y-8 px-6 xl:px-10 py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 font-homenaje rtl:font-almarai text-sm text-gray-400">
              <IoMdHome size={28} color="black" className="-mt-2" />
              {t("navigation.phoneNumbers")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="pb-10 pt-5 space-y-8">
        <h2 className="text-3xl font-homenaje rtl:font-almarai  text-main-black mb-5">
          {t("dashboard.title")}
        </h2>
        <PhoneNumbersTable phoneNumbers={phoneNumbers} />
      </div>
    </div>
  );
}
