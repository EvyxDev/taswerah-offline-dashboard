/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Calendar, ArrowRight, ArrowLeft } from "lucide-react";
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

// Define the props interface
interface ReusableDataTableProps<T> {
  data: T[];
  headers: Record<string, string>;
  title: string;
  itemsPerPage?: number;
  showBadge?: boolean;
  emptyStateIcon?: React.ReactNode;
  emptyStateMessage?: string;
  className?: string;
  renderCell?: (
    key: string,
    value: any,
    item: T,
    index: number
  ) => React.ReactNode;
  rowClassName?: (item: T, index: number) => string;
  columnWidths?: Record<string, string>;
}

export default function ReusableDataTable<T>({
  data,
  headers,
  title,
  itemsPerPage = 7,
  showBadge = true,
  emptyStateIcon = <Calendar className="h-8 w-8" />,
  emptyStateMessage = "No data found",
  renderCell,
  rowClassName = (item: T, index: number) =>
    index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white",
  columnWidths = {},
}: ReusableDataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

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
    const pages: (number | string)[] = [];
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

  // Default cell renderer
  const defaultRenderCell = (key: string, value: any) => {
    return (
      <span className="font-homenaje rtl:font-almarai text-lg font-medium text-muted-foreground">
        {value}
      </span>
    );
  };

  return (
    <div className="w-full h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-7">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-homenaje rtl:font-almarai text-foreground">
            {title}
          </h2>
          {showBadge && (
            <Badge
              variant="secondary"
              className="bg-[#535862] font-homenaje rtl:font-almarai text-white hover:bg-[#535862]"
            >
              {data.length}
            </Badge>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border">
        <Table className="px-5">
          <TableHeader>
            <TableRow className="px-7">
              {Object.entries(headers).map(([key, displayName]) => (
                <TableHead
                  key={key}
                  className={`text-start text-gray-400 font-homenaje rtl:font-almarai text-lg ${
                    columnWidths[key] || ""
                  }`}
                >
                  {displayName}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  className={`px-7 h-[70px] ${rowClassName(item, index)}`}
                >
                  {Object.keys(headers).map((key) => {
                    const value = (item as any)[key];
                    return (
                      <TableCell key={key} className="text-start">
                        {renderCell
                          ? renderCell(key, value, item, index)
                          : defaultRenderCell(key, value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={Object.keys(headers).length}
                  className="text-center py-8"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    {emptyStateIcon}
                    <p>{emptyStateMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Only show if there are results */}
      {paginatedData.length > 0 && (
        <div className="flex items-center justify-between mt-6 px-7">
          <Button
            variant="ghost"
            className="flex items-center gap-2 font-homenaje rtl:font-almarai text-xl shadow-sm border disabled:bg-[#FAFAFA]"
            onClick={goToPrevious}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="h-8 w-8" />
            Previous
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
            className="flex items-center gap-2 font-homenaje rtl:font-almarai text-xl shadow-sm border"
            onClick={goToNext}
            disabled={currentPage === totalPages}
          >
            Next
            <ArrowRight className="h-8 w-8" />
          </Button>
        </div>
      )}
    </div>
  );
}
