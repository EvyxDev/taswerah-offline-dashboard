"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Folder from "@/components/common/folder";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { RiFilter2Fill } from "react-icons/ri";
import Link from "next/link";
import { dateOptions } from "@/lib/constants/data.constant";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { IoMdHome } from "react-icons/io";

type PrintedSentPageProps = {
  printed: string[];
};

export default function PrintedPage({ printed }: PrintedSentPageProps) {
  const t = useTranslations("printedSent");
  const [selectedDate, setSelectedDate] = useState("2025-02-20");
  useLocale();

  const getSelectedDateLabel = () => {
    const option = dateOptions.find((opt) => opt.value === selectedDate);
    return option ? option.label : "20-02-2025";
  };
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const renderList = (codes: string[]) => {
    if (!codes || codes.length === 0) {
      return (
        <div className="text-center text-gray-500 font-homenaje rtl:font-almarai w-full py-8">
          {t("noData") || "No data to show"}
        </div>
      );
    }
    return (
      <div className="flex items-center gap-5 w-full flex-wrap">
        {codes.map((code) => (
          <Link
            key={code}
            href={`printed-sent/folder/${code}`}
            className="w-full max-w-[230px]"
          >
            <Folder id={code} />
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 px-6 xl:px-10 py-5">
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

      <div className="py-10">
        <div className="w-full">
          <div className="flex flex-col gap-5 sm:flex-row items-center justify-between">
            <div className="text-xl sm:text-3xl font-homenaje rtl:font-almarai py-2 sm:py-4 px-4 sm:px-8 rounded-2xl bg-black text-white">
              {t("printedTab")}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="self-end" asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2  font-homenaje rtl:font-almarai !text-[#5B5B5B] rounded-full bg-[#F5F6FA] "
                >
                  <RiFilter2Fill className="h-4 w-4" />
                  {t("date")}: {getSelectedDateLabel()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-44">
                {dateOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleDateChange(option.value)}
                    className={selectedDate === option.value ? "bg-muted" : ""}
                  >
                    {option.label}
                    {selectedDate === option.value && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        ✓
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-10">{renderList(printed)}</div>
        </div>
      </div>
    </div>
  );
}
