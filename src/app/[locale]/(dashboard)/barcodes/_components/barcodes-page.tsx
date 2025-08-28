"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import type { PaginatedBarcodes } from "@/lib/api/barcodes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PaginationComponent } from "@/components/common/pagination-comp";
import GenerateBarcodesDialog from "./generate-barcodes-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { IoMdHome } from "react-icons/io";

type Props = {
  barcodes: PaginatedBarcodes;
  pagination: {
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  filter?: "yes" | "no";
};

export default function BarcodesPage({ barcodes, pagination, filter }: Props) {
  const t = useTranslations("barcodes");
  const router = useRouter();
  const pathname = usePathname();
  const selectedFilterValue = filter === "yes" ? "yes" : "all";

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    params.set("limit", pagination.limit.toString());
    if (filter === "yes" || filter === "no") {
      params.set("filter", filter);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (nextValue: "all" | "yes") => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", pagination.limit.toString());
    if (nextValue === "yes") params.set("filter", "yes");
    router.push(`${pathname}?${params.toString()}`);
  };

  const rows = barcodes?.data || [];

  return (
    <div className="space-y-8 px-6 xl:px-10 pt-10 pb-32 h-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 font-homenaje rtl:font-almarai text-sm text-gray-400">
              <IoMdHome size={28} color="black" className="-mt-2" />{" "}
              {t("title", { default: "Barcodes" })}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h2 className="text-3xl font-homenaje rtl:font-almarai  text-main-black mb-5">
        {t("title", { default: "Barcodes" })}
      </h2>
      <Card className="bg-background max-w-screen-2xl mx-auto rounded-2xl py-6 ">
        <div className="w-full">
          <div className="flex items-center justify-between mb-5 px-7">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-homenaje rtl:font-almarai text-foreground">
                {t("title", { default: "Barcodes" })}
              </h3>
              <Badge
                variant="secondary"
                className="bg-[#535862] font-homenaje rtl:font-almarai text-white hover:bg-[#535862]"
              >
                {rows.length}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="min-w-[160px]">
                <Select
                  value={selectedFilterValue}
                  onValueChange={(v) => handleFilterChange(v as "all" | "yes")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("used", { default: "Used" })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("all", { default: "All" })}
                    </SelectItem>
                    <SelectItem value="yes">
                      {t("yes", { default: "Yes" })}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <GenerateBarcodesDialog />
            </div>
          </div>

          <div className="border">
            <Table className="px-5">
              <TableHeader>
                <TableRow className="px-7">
                  <TableHead className="font-medium font-homenaje rtl:font-almarai text-black text-lg   text-muted-foreground text-start w-[200px]">
                    {t("barcode", { default: "Barcode" })}
                  </TableHead>
                  <TableHead className="font-medium font-homenaje rtl:font-almarai text-black text-lg   text-muted-foreground text-start w-[200px]">
                    {t("used", { default: "Used" })}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((item, index) => (
                    <TableRow
                      key={`${item.barcode}-${index}`}
                      className={`px-7 h-[70px] ${
                        index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white"
                      }`}
                    >
                      <TableCell>
                        <span className="font-homenaje rtl:font-almarai text-lg">
                          {item.barcode}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-homenaje rtl:font-almarai text-lg">
                          {item.used
                            ? t("yes", { default: "Yes" })
                            : t("no", { default: "No" })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <p>{t("empty", { default: "No barcodes found" })}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {rows.length > 0 && (
            <div className="mt-6">
              <PaginationComponent
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                maxVisiblePages={5}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
