import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  totalItems: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const TablePagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const tNav = useTranslations("navigation");

  const goToPage = (page: number) => {
    onPageChange(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

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

  return (
    <div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-7">
          <Button
            variant="ghost"
            className="flex items-center gap-2 font-homenaje rtl:font-almarai text-xl shadow-sm border disabled:bg-[#FAFAFA]"
            onClick={goToPrevious}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="h-8 w-8 rtl:rotate-180" />
            {tNav("previous")}
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
            {tNav("next")}
            <ArrowRight className="h-8 w-8 rtl:rotate-180" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TablePagination;
