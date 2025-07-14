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

export default function PrintedPage() {
  const t = useTranslations("printedSent");
  const [selectedDate, setSelectedDate] = useState("2025-02-20");

  const getSelectedDateLabel = () => {
    const option = dateOptions.find((opt) => opt.value === selectedDate);
    return option ? option.label : "20-02-2025";
  };
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };
  const [activeTab, setActiveTab] = useState("printed");
  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "en";

  const tabs = [
    { value: "printed", label: t("printedTab") },
    { value: "sent", label: t("sentTab") },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "printed":
        return (
          <div className="flex items-center gap-5 w-full flex-wrap">
            {[...Array(7)].map((_, idx) => (
              <Link
                key={idx}
                href={`printed-sent/folder/${idx + 1}`}
                className="w-full max-w-[300px]"
              >
                <Folder />
              </Link>
            ))}
          </div>
        );
      case "sent":
        return (
          <div className="flex items-center gap-5 w-full flex-wrap">
            {[...Array(7)].map((_, idx) => (
              <Link
                key={idx}
                href={`printed-sent/folder/${idx + 1}`}
                className="w-full max-w-[300px]"
              >
                <Folder />
              </Link>
            ))}
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-5 w-full flex-wrap">
            {[...Array(7)].map((_, idx) => (
              <Link
                key={idx}
                href={`folder/${idx + 1}`}
                className="w-full max-w-[300px]"
              >
                <Folder />
              </Link>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 px-6 xl:px-10 py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 font-homenaje text-sm text-gray-400">
              {t("breadcrumb")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-10">
        <div className="w-full">
          {/* Custom Tab Navigation */}
          <div className="flex flex-col gap-5   sm:flex-row  items-center justify-between">
            <div className="bg-transparent gap-5 flex self-start">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={` text-xl sm:text-3xl font-homenaje py-2 sm:py-4 px-4 sm:px-8 rounded-2xl transition-colors ${
                    activeTab === tab.value
                      ? "bg-black text-white"
                      : "bg-[#FAFAFA] text-black hover:bg-gray-200"
                  }`}
                  style={{
                    direction: locale === "ar" ? "rtl" : "ltr",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="self-end" asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2  font-homenaje !text-[#5B5B5B] rounded-full bg-[#F5F6FA] "
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

          {/* Content */}
          <div className="mt-10">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
