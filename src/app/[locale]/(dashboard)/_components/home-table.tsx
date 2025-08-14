"use client";

import { Calendar } from "lucide-react";
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
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PaginationComponent } from "@/components/common/pagination-comp";
// import TablePagination from "./table-pagination";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
interface Props {
  PhotoGraphers: Employee[];
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}
export default function HomeTable0({
  currentPage,
  PhotoGraphers,
  onPageChange,
  totalPages,
}: Props) {
  // locale = useLocale();
  const t = useTranslations();
  // const [currentPage, setCurrentPage] = useState(1);
  // const limit = 5;

  // const {
  //   data: branchData,

  // } = useQuery<APIResponse<BranchListData>, Error>({
  //   queryKey: ["branches", "ar", currentPage, limit],
  //   queryFn: () => GetListBranches("ar", currentPage, limit),
  // });

  // const successfulResponse = branchData as SuccessfulResponse<BranchListData>;

  const PhotoGraphersData = PhotoGraphers;
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
              {PhotoGraphersData.length}
            </Badge>
          </div>

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center text-xs sm:text-base px-1 sm:px-4 gap-2 bg-transparent self-end"
              >
                <Calendar className="sm:h-4 h-2 w-2 sm:w-4" />
                {t("dashboard.date")}:
                <ChevronDown className="sm:h-4 h-2 w-2 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {dateOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
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
          </DropdownMenu> */}
        </div>
        {/* Table */}
        <div className="border">
          <Table className="px-5">
            <TableHeader>
              <TableRow className=" px-7">
                <TableHead className="font-medium font-homenaje text-lg rtl:text-3xl text-gray-400 text-muted-foreground text-start min-w-[200px] ">
                  {t("dashboard.name")}
                </TableHead>
                <TableHead className="font-medium font-homenaje text-lg rtl:text-3xl text-gray-400 text-muted-foreground text-center  min-w-[150px] sm:w-[100px]">
                  {t("dashboard.noCustomers")}
                </TableHead>
                <TableHead className="font-medium font-homenaje text-lg rtl:text-3xl text-gray-400 text-muted-foreground text-center  min-w-[150px] sm:w-[100px]">
                  {t("dashboard.noPhotos")}
                </TableHead>
                <TableHead className="font-medium font-homenaje text-lg rtl:text-3xl text-gray-400 text-muted-foreground text-center min-w-[150px] sm:w-[150px]">
                  {t("dashboard.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {PhotoGraphersData?.length > 0 ? (
                PhotoGraphersData?.map((PhotoGrapher, index) => (
                  <TableRow
                    key={PhotoGrapher.id}
                    className={`px-7 h-[70px] ${
                      index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white"
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3 ">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={PhotoGrapher.name || "/placeholder.svg"}
                            alt={PhotoGrapher.name}
                          />
                          <AvatarFallback className="text-sm font-medium">
                            {PhotoGrapher.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium font-homenaje text-lg">
                            {PhotoGrapher.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-homenaje text-lg font-medium text-muted-foreground ml-12">
                      {PhotoGrapher.stats.total_customers}
                    </TableCell>
                    <TableCell className="text-center font-homenaje text-lg font-medium text-muted-foreground">
                      {PhotoGrapher.stats.total_photos}
                    </TableCell>
                    <TableCell className="text-center font-homenaje text-lg font-medium !text-white ">
                      <Link
                        href={`/employee-photos/${PhotoGrapher.id}?name=${PhotoGrapher.name}`}
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
                      <Button variant="ghost" size="sm" className="text-xs">
                        {t("dashboard.viewAllEmployees")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {PhotoGraphersData?.length > 0 && (
          <>
            <div className="mt-6">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                maxVisiblePages={5}
              />
            </div>
          </>
        )}{" "}
      </div>
    </Card>
  );
}
