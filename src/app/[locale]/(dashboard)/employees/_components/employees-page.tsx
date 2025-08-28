"use client";

import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import PhotographersTable from "./photographers-table";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";

type Props = {
  PhotoGraphers: PaginatedPhGraphers;
  pagination: {
    currentPage: number;
    totalPages: number;
    limit: number;
  };
};

export default function EmployeesPage({ PhotoGraphers, pagination }: Props) {
  // Translation
  const t = useTranslations("employees");
  // const locale = useLocale();

  // Router
  const router = useRouter();
  const pathname = usePathname();

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    params.set("limit", pagination.limit.toString());

    // Update URL with new parameters
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-8 px-6 xl:px-10 py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 font-homenaje rtl:font-almarai text-sm text-gray-400">
              {t("photographersTab")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-10">
        <PhotographersTable
          PhotoGraphers={PhotoGraphers}
          onPageChange={handlePageChange}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      </div>
    </div>
  );
}
