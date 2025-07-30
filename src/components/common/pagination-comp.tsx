import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

type PaginationComponentProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  maxVisiblePages?: number;
};

export function PaginationComponent({
  currentPage: initialCurrentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationComponentProps) {
  // States
  const [internalCurrentPage, setInternalCurrentPage] =
    useState(initialCurrentPage);

  // Variables
  const currentPage = onPageChange ? initialCurrentPage : internalCurrentPage;

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Function to generate the page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const halfMaxVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfMaxVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Always show the first page
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("ellipsis");
      }
    }

    // Add the range of pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show the last page if we're not at the end
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  // Handle page change
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent className="w-full flex items-center justify-between px-7">
        <PaginationItem>
          <PaginationPrevious
            disabled={!hasPrevious}
            onClick={(e) => {
              e.preventDefault();
              if (hasPrevious) handlePageChange(currentPage - 1);
            }}
            className="text-zinc-800"
          />
        </PaginationItem>

        <div className="flex flex-row items-center gap-1">
          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page as number);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
        </div>

        <PaginationItem>
          <PaginationNext
            disabled={!hasNext}
            onClick={(e) => {
              e.preventDefault();
              if (hasNext) handlePageChange(currentPage + 1);
            }}
            className="text-zinc-800"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
