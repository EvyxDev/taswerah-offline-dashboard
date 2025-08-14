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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PrintedSentPageProps = {
  printed: string[];
  sent: string[];
};

export default function PrintedPage({ printed, sent }: PrintedSentPageProps) {
  const t = useTranslations("printedSent");
  const [selectedDate, setSelectedDate] = useState("2025-02-20");
  const [activeTab, setActiveTab] = useState("printed");
  console.log(sent);
  console.log(printed);
  const getSelectedDateLabel = () => {
    const option = dateOptions.find((opt) => opt.value === selectedDate);
    return option ? option.label : "20-02-2025";
  };
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "en";

  const renderList = (codes: string[]) => {
    if (!codes || codes.length === 0) {
      return (
        <div className="text-center text-gray-500 font-homenaje w-full py-8">
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
            className="w-full max-w-[300px]"
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
            <BreadcrumbPage className="flex items-center gap-2 font-homenaje text-sm text-gray-400">
              {t("breadcrumb")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-10">
        <div className="w-full">
          <div className="flex flex-col gap-5 sm:flex-row items-center justify-between">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <TabsList className="bg-transparent gap-5 h-auto p-0 justify-start">
                <TabsTrigger
                  value="printed"
                  className="text-xl sm:text-3xl font-homenaje py-2 sm:py-4 px-4 sm:px-8 rounded-2xl transition-colors data-[state=active]:bg-black data-[state=active]:text-white bg-[#FAFAFA] text-black hover:bg-gray-200"
                >
                  {t("printedTab")}
                </TabsTrigger>
                <TabsTrigger
                  value="sent"
                  className="text-xl sm:text-3xl font-homenaje py-2 sm:py-4 px-4 sm:px-8 rounded-2xl transition-colors data-[state=active]:bg-black data-[state=active]:text-white bg-[#FAFAFA] text-black hover:bg-gray-200"
                >
                  {t("sentTab")}
                </TabsTrigger>
              </TabsList>
            </Tabs>

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

          <div className="mt-10">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <TabsContent value="printed">{renderList(printed)}</TabsContent>
              <TabsContent value="sent">{renderList(sent)}</TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
