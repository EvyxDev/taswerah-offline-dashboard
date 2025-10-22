"use client";

import { Users } from "lucide-react";
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

import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { PaginationComponent } from "@/components/common/pagination-comp";
import EmptyState from "@/components/common/empty-state";

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
  const t = useTranslations();

  const PhotoGraphersData = PhotoGraphers;
  return (
    <Card className=" bg-background max-w-screen-2xl mx-auto rounded-2xl py-6 ">
      <div className="">
        {/* Header */}
        <div className="flex sm:flex-row gap-5 flex-col items-center justify-between mb-8 px-7">
          <div className="flex items-center gap-3 self-start">
            <h2 className="text-2xl font-homenaje rtl:font-almarai  text-foreground">
              {t("navigation.employees")}
            </h2>
            <Badge
              variant="secondary"
              className="bg-[#535862] font-homenaje rtl:font-almarai rtl:text-sm text-white hover:bg-[#535862]"
            >
              {PhotoGraphersData.length}
            </Badge>
          </div>
        </div>
        {PhotoGraphersData?.length > 0 ? (
          <div className="border">
            <Table className="px-5">
              <TableHeader>
                <TableRow className=" px-7">
                  <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg   text-gray-400 text-muted-foreground text-start min-w-[200px] ">
                    {t("dashboard.name")}
                  </TableHead>
                  <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg   text-gray-400 text-muted-foreground text-center  min-w-[150px] sm:w-[100px]">
                    {t("dashboard.noCustomers")}
                  </TableHead>
                  <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg   text-gray-400 text-muted-foreground text-center  min-w-[150px] sm:w-[100px]">
                    {t("dashboard.noPhotos")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {PhotoGraphersData?.map((PhotoGrapher, index) => (
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
                          <span className="font-medium font-homenaje rtl:font-almarai text-lg">
                            {PhotoGrapher.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-homenaje rtl:font-almarai text-lg font-medium text-muted-foreground ml-12">
                      {PhotoGrapher.stats?.total_customers}
                    </TableCell>
                    <TableCell className="text-center font-homenaje rtl:font-almarai text-lg font-medium text-muted-foreground">
                      {PhotoGrapher.stats?.total_photos}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState
            icon={<Users className="w-12 h-12 text-gray-400" />}
            title={t("dashboard.noEmployeesFound")}
            description={t("dashboard.noEmployeesDescription", {
              default:
                "No employees have been added yet. Add your first employee to get started.",
            })}
          />
        )}
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
