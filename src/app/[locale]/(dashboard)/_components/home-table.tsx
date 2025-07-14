"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { allEmployees, dateOptions } from "@/lib/constants/data.constant";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import Link from "next/link";
const ITEMS_PER_PAGE = 7;

export default function HomeTable() {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("2025-02-20");

  // Filter employees based on selected date
  const filteredEmployees = useMemo(() => {
    if (selectedDate === "all") {
      return allEmployees;
    }

    if (selectedDate === "week") {
      // Filter for last week (Feb 14-20, 2025)
      const weekStart = "2025-02-14";
      const weekEnd = "2025-02-20";
      return allEmployees.filter(
        (employee) =>
          employee.lastActivity >= weekStart && employee.lastActivity <= weekEnd
      );
    }

    return allEmployees.filter(
      (employee) => employee.lastActivity === selectedDate
    );
  }, [selectedDate]);

  // Reset to page 1 when filter changes
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const getSelectedDateLabel = () => {
    const option = dateOptions.find((opt) => opt.value === selectedDate);
    return option ? option.label : "20-02-2025";
  };

  return (
    <Card className=" bg-background max-w-screen-2xl mx-auto rounded-2xl py-6 ">
      <div className="">
        {/* Header */}
        <div className="flex sm:flex-row gap-5 flex-col items-center justify-between mb-8 px-7">
          <div className="flex items-center gap-3 self-start">
            <h2 className="text-2xl font-homenaje  text-foreground">
              {t("navigation.employees")}
            </h2>
            <Badge
              variant="secondary"
              className="bg-[#535862] font-homenaje t text-white hover:bg-[#535862]"
            >
              {filteredEmployees.length}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center text-xs sm:text-base px-1 sm:px-4 gap-2 bg-transparent self-end"
              >
                <Calendar className="sm:h-4 h-2 w-2 sm:w-4" />
                {t("dashboard.date")}: {getSelectedDateLabel()}
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
              <TableRow className=" px-7">
                <TableHead className="font-medium font-homenaje text-lg text-gray-400 text-muted-foreground text-start min-w-[200px] ">
                  {t("dashboard.name")}
                </TableHead>
                <TableHead className="font-medium font-homenaje text-lg text-gray-400 text-muted-foreground text-center  min-w-[150px] sm:w-[100px]">
                  {t("dashboard.noCustomers")}
                </TableHead>
                <TableHead className="font-medium font-homenaje text-lg text-gray-400 text-muted-foreground text-center  min-w-[150px] sm:w-[100px]">
                  {t("dashboard.noPhotos")}
                </TableHead>
                <TableHead className="font-medium font-homenaje text-lg text-gray-400 text-muted-foreground text-center min-w-[150px] sm:w-[150px]">
                  {t("dashboard.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee, index) => (
                  <TableRow
                    key={employee.id}
                    className={`px-7 h-[70px] ${
                      index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white"
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3 ">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={employee.avatar || "/placeholder.svg"}
                            alt={employee.name}
                          />
                          <AvatarFallback className="text-sm font-medium">
                            {employee.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium font-homenaje text-lg">
                            {employee.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-homenaje text-lg font-medium text-muted-foreground ml-12">
                      {employee.customers}
                    </TableCell>
                    <TableCell className="text-center font-homenaje text-lg font-medium text-muted-foreground">
                      {employee.photos}
                    </TableCell>
                    <TableCell className="text-center font-homenaje text-lg font-medium !text-white ">
                      <Link
                        href={`/employee-photos/${employee.id}`}
                        className={
                          index % 2 === 0
                            ? "bg-black rounded-full px-2 cursor-pointer text-white py-1"
                            : "bg-gray-500 rounded-full px-2 cursor-pointer text-white py-1"
                        }
                      >
                        {t("dashboard.viewPhotos")}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Calendar className="h-8 w-8" />
                      <p>{t("dashboard.noEmployeesFound")}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDateChange("all")}
                        className="text-xs"
                      >
                        {t("dashboard.viewAllEmployees")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - Only show if there are results */}
        {filteredEmployees.length > 0 && (
          <div className="mt-6 px-4 md:px-7">
            {/* Mobile pagination */}
            <div className="flex items-center justify-between md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                disabled={currentPage === totalPages}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Desktop pagination */}
            <div className="hidden md:flex items-center justify-between">
              <Button
                variant="ghost"
                className="flex items-center gap-2 font-homenaje text-xl shadow-sm border disabled:bg-[#FAFAFA]"
                onClick={goToPrevious}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-8 w-8" />
                {t("dashboard.previous")}
              </Button>

              <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === "..." ? (
                      <span className="px-2 text-muted-foreground">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "ghost"}
                        size="sm"
                        className={`w-8 h-8 p-0 ${
                          currentPage === page
                            ? "bg-slate-200 text-black hover:bg-slate-200"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => goToPage(page as number)}
                      >
                        {page}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                className="flex items-center gap-2 font-homenaje text-xl shadow-sm border"
                onClick={goToNext}
                disabled={currentPage === totalPages}
              >
                {t("dashboard.next")}
                <ArrowRight className="h-8 w-8" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
