"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { IoMdHome } from "react-icons/io";

import { useTranslations } from "next-intl";
import PhotographersTable from "../employees/_components/photographers-table";
import { usePathname, useRouter } from "@/i18n/routing";

type Props = {
  PhotoGraphers: Employee[];
  pagination: {
    currentPage: number;
    totalPages: number[];
    limit: number;
  };
};

export default function HomePage({ PhotoGraphers, pagination }: Props) {
  // Translation
  const t = useTranslations("employees");

  // Router
  const router = useRouter();
  const pathname = usePathname();
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    params.set("limit", pagination.limit.toString());

    // Update URL with new parameters
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className=" space-y-8 px-6 xl:px-10 py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 font-homenaje rtl:font-almarai text-sm text-gray-400">
              <IoMdHome size={28} color="black" className="-mt-2" />
              {t("navigation.dashboard")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="pb-10 pt-5 space-y-8">
        <h2 className="text-3xl font-homenaje rtl:font-almarai  text-main-black mb-5">
          {t("dashboard.employees")}
        </h2>
        <PhotographersTable
          PhotoGraphers={{
            data: PhotoGraphers,
            meta: {
              last_page: pagination.totalPages[0],
              current_page: pagination.currentPage,
              from: 1,
              to: PhotoGraphers.length,
              total: PhotoGraphers.length,
              per_page: pagination.limit,
              links: [],
              path: "",
            },
            links: {
              first: "",
              last: "",
              prev: null,
              next: null,
            },
            photographer_count: PhotoGraphers.length,
          }}
          onPageChange={handlePageChange}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages[0]}
        />
      </div>
    </div>
  );
}
