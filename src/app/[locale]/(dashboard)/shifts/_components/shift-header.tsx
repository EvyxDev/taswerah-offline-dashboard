"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { FaPlus } from "react-icons/fa6";

export default function ShiftHeader({
  count,
  onCreate,
}: {
  count: number;
  onCreate: () => void;
}) {
  const t = useTranslations();
  return (
    <div className="flex sm:flex-row gap-5 flex-col items-center justify-between mb-8 px-7">
      <div className="flex items-center gap-3 self-start">
        <h2 className="text-2xl font-homenaje rtl:font-almarai text-foreground">
          {t("navigation.shifts")}
        </h2>
        <Badge
          variant="secondary"
          className="bg-[#535862] font-homenaje rtl:font-almarai text-white hover:bg-[#535862]"
        >
          {count}
        </Badge>
      </div>
      <Button
        variant="default"
        className="font-homenaje rtl:font-almarai text-lg main-button !w-[50px] !px-2 !py-0 !rounded-none"
        onClick={onCreate}
      >
        <FaPlus className="!text-6xl" />
      </Button>
    </div>
  );
}
