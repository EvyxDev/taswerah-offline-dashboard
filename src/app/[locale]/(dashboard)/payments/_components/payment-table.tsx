/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PayemntData, dateOptions } from "@/lib/constants/data.constant";
import { Card } from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";
import { ReceiptDialog } from "./receipt-dialog";

export default function PaymentTable({ clients }: { clients: Client[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("all");

  // Filter employees based on selected date
  const filteredEmployees = useMemo(() => {
    if (selectedDate === "all") {
      return PayemntData;
    }

    if (selectedDate === "week") {
      // Filter for last week (Feb 14-20, 2025)
      const weekStart = "2025-02-14";
      const weekEnd = "2025-02-20";
      return PayemntData.filter(
        (employee) =>
          employee.lastActivity >= weekStart && employee.lastActivity <= weekEnd
      );
    }

    return PayemntData.filter(
      (employee) => employee.lastActivity === selectedDate
    );
  }, [selectedDate]);

  // Reset to page 1 when filter changes
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const getSelectedDateLabel = () => {
    const option = dateOptions.find((opt) => opt.value === selectedDate);
    return option ? option.label : "20-02-2025";
  };

  const formatDateTime = (value?: string | number | Date) => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card className=" bg-background max-w-screen-2xl mx-auto rounded-2xl py-6 ">
      <div className="">
        {/* Header */}
        <div className="flex sm:flex-row gap-5 flex-col items-center justify-between mb-8 px-7">
          <div className="flex items-center gap-3 self-start">
            <h2 className="text-2xl font-homenaje rtl:font-almarai  text-foreground">
              {t("payments.clients")}
            </h2>
            <Badge
              variant="secondary"
              className="bg-[#535862] font-homenaje rtl:font-almarai t text-white hover:bg-[#535862]"
            >
              {clients?.length || 0}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center text-xs sm:text-base px-1 sm:px-4 gap-2 bg-transparent self-end"
              >
                <Calendar className="sm:h-4 h-2 w-2 sm:w-4" />
                {t("payments.date")}: {getSelectedDateLabel()}
                <ChevronDown className="sm:h-4 h-2 w-2 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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

        {/* Table */}
        <div className="border">
          <Table className="px-5">
            <TableHeader>
              <TableRow className="px-7">
                <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg   text-gray-400 text-muted-foreground text-start min-w-[100px]">
                  {t("payments.clientCode")}
                </TableHead>

                <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg text-gray-400 text-muted-foreground text-center min-w-[150px] ">
                  {t("payments.phoneNumber")}
                </TableHead>
                <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg text-gray-400 text-muted-foreground text-center min-w-[150px] ">
                  {t("payments.amount")}
                </TableHead>
                <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg   text-gray-400 text-muted-foreground text-center min-w-[150px]">
                  {t("payments.date")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients?.length > 0 ? (
                clients?.map((client, index) => (
                  <TableRow
                    key={client.barcode}
                    className={`px-7 h-[70px] ont-homenaje ${
                      index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white"
                    }`}
                  >
                    <TableCell>{client.barcode}</TableCell>

                    <TableCell className="text-center font-homenaje rtl:font-almarai text-lg ">
                      {client.phone_number}
                    </TableCell>
                    <TableCell className="text-center font-homenaje rtl:font-almarai text-lg ">
                      100
                    </TableCell>
                    <TableCell className="text-center font-homenaje rtl:font-almarai text-lg mx-auto ">
                      {formatDateTime(client.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Calendar className="h-8 w-8" />
                      <p>{t("dashboard.noEmployeesFound")}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDateChange("all")}
                        className="text-xs"
                      >
                        {t("dashboard.viewPayemntData")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
