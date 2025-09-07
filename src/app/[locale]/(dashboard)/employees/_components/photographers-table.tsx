"use client";

import { FaPen } from "react-icons/fa";
import { HiMiniTrash } from "react-icons/hi2";
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
import AddOrEditPhotographerDialog from "./add-photographer-dialog";
import { Switch } from "@/components/ui/switch";
import DeleteDialog from "@/components/common/delete-dialog";
import { PaginationComponent } from "@/components/common/pagination-comp";
import { toast } from "sonner";
import useToggleEmployeeStatus from "../_hooks/use-toggle-employee-status";
import useDeleteEmployeer from "../_hooks/use-delete-employeer";

interface Props {
  PhotoGraphers: PaginatedPhGraphers;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

export default function PhotographersTable({
  PhotoGraphers,
  onPageChange,
  currentPage,
  totalPages,
}: Props) {
  // Translation
  const t = useTranslations("employees");

  const { toggleStatus, togglePending } = useToggleEmployeeStatus();
  const { DeleteEmployeer } = useDeleteEmployeer();

  // Variables
  const photoGraphersData = PhotoGraphers?.data;
  const handleToggleStatus = (photographer: PhGrapher) => {
    const nextStatus = photographer.status === "active" ? "inactive" : "active";
    toggleStatus(
      { photographerId: photographer.id, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(
            nextStatus === "active"
              ? "Activated successfully"
              : "Deactivated successfully"
          );
        },
        onError: (error: unknown) => {
          toast.error("Failed to toggle status");
          console.error("Toggle error:", error);
        },
      }
    );
  };

  return (
    <Card className="bg-background max-w-screen-2xl mx-auto rounded-2xl py-6 h-full ">
      <div className="w-full  h-fit">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-7">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-homenaje rtl:font-almarai  text-foreground">
              {t("photographersTab")}
            </h2>
            <Badge
              variant="secondary"
              className="bg-[#535862] font-homenaje rtl:font-almarai t text-white hover:bg-[#535862]"
            >
              {photoGraphersData?.length || 0}
            </Badge>
          </div>
          <AddOrEditPhotographerDialog />
        </div>

        {/* Table */}
        <div className="border">
          <Table className="px-5">
            <TableHeader>
              <TableRow className=" px-7">
                <TableHead className="font-medium font-homenaje rtl:font-almarai text-black text-lg    text-muted-foreground text-start  w-[150px]">
                  {t("status")}
                </TableHead>
                <TableHead className="font-medium font-homenaje rtl:font-almarai text-black text-lg    text-muted-foreground text-start  ">
                  {t("name")}
                </TableHead>
                <TableHead className="font-medium font-homenaje rtl:font-almarai text-black text-lg    text-muted-foreground text-center w-[250px] ">
                  {t("branch")}
                </TableHead>
                <TableHead className="font-medium font-homenaje rtl:font-almarai text-black text-lg   text-muted-foreground text-center w-[100px] "></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {photoGraphersData?.length > 0 ? (
                photoGraphersData?.map((photoGrapher, index) => (
                  <TableRow
                    key={index}
                    className={`px-7 h-[70px] ${
                      index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white"
                    }`}
                  >
                    <TableCell>
                      <Switch
                        onCheckedChange={() => handleToggleStatus(photoGrapher)}
                        disabled={togglePending}
                        checked={photoGrapher.status === "active"}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 ">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              photoGrapher.name.charAt(2) || "/placeholder.svg"
                            }
                            alt={photoGrapher.name}
                          />
                          <AvatarFallback className="text-sm font-medium uppercase ">
                            {photoGrapher.name.charAt(0) +
                              photoGrapher.name.charAt(1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium font-homenaje rtl:font-almarai text-lg ">
                            {photoGrapher.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-homenaje rtl:font-almarai text-lg  font-medium text-muted-foreground ml-12">
                      {photoGrapher?.branch?.name || t("unknown")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-7">
                        <DeleteDialog
                          action={({ email, password } = {}) =>
                            DeleteEmployeer({
                              id: String(photoGrapher.id),
                              email,
                              password,
                            })
                          }
                          description="Are you sure you want to delete this Photographers? This action cannot be undone."
                          title="Delete Photographers"
                        >
                          <button className="">
                            <HiMiniTrash className="text-black text-2xl" />
                          </button>
                        </DeleteDialog>
                        <AddOrEditPhotographerDialog
                          edit={true}
                          photoGrapher={photoGrapher}
                          trigger={
                            <button className=" text-black">
                              <FaPen />
                            </button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <p>{t("noEmployeesFound")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - Only show if there are results */}
        {photoGraphersData?.length > 0 && (
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
        )}
      </div>
    </Card>
  );
}
