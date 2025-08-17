"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDeleteShift from "../_hooks/use-delete-shift";
import { toast } from "sonner";
import ShiftHeader from "./shift-header";
import ShiftActionsCell from "./shift-actions-cell";
import ShiftFormDialog from "./shift-form-dialog";
import { useTranslations } from "next-intl";

type Props = {
  shifts: TShift[];
};

export default function ShiftsTable({ shifts }: Props) {
  const router = useRouter();
  const { deleteShift } = useDeleteShift();
  const t = useTranslations();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<TShift | null>(null);

  const openCreate = () => {
    setEditingShift(null);
    setIsDialogOpen(true);
  };

  const openEdit = (shift: TShift) => {
    setEditingShift(shift);
    setIsDialogOpen(true);
  };

  const onDelete = (id: number | string) => {
    deleteShift(id, {
      onSuccess: () => {
        toast.success("Shift deleted");
        router.refresh();
      },
      onError: (e: unknown) =>
        toast.error((e as Error)?.message || "Delete failed"),
    });
  };

  return (
    <Card className="bg-background max-w-screen-2xl w-full mx-auto rounded-2xl py-6">
      <ShiftHeader count={shifts.length} onCreate={openCreate} />

      <div className="border">
        <Table className="px-5">
          <TableHeader>
            <TableRow className="px-7">
              <TableHead className="font-medium font-homenaje text-lg rtl:text-3xl text-gray-400 text-start min-w-[180px]">
                {t("shifts.name")}
              </TableHead>
              <TableHead className="font-medium font-homenaje text-lg rtl:text-3xl text-gray-400 text-center min-w-[120px]">
                {t("shifts.from")}
              </TableHead>
              <TableHead className="font-medium font-homenaje text-lg rtl:text-3xl text-gray-400 text-center min-w-[120px]">
                {t("shifts.to")}
              </TableHead>
              <TableHead className="font-medium font-homenaje text-lg rtl:text-3xl text-gray-400 text-center min-w-[200px]">
                {t("shifts.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift, index) => (
              <TableRow
                key={shift.id}
                className={`px-7 h-[70px] ${
                  index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white"
                }`}
              >
                <TableCell className="text-start font-homenaje text-lg font-medium">
                  {shift.name}
                </TableCell>
                <TableCell className="text-center font-homenaje text-lg font-medium text-muted-foreground">
                  {shift.from?.slice(0, 5)}
                </TableCell>
                <TableCell className="text-center font-homenaje text-lg font-medium text-muted-foreground">
                  {shift.to?.slice(0, 5)}
                </TableCell>
                <TableCell className="text-center">
                  <ShiftActionsCell
                    onEdit={() => openEdit(shift)}
                    onDelete={() => onDelete(shift.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ShiftFormDialog
        open={isDialogOpen}
        onOpenChange={() => setIsDialogOpen(false)}
        mode={editingShift ? "edit" : "create"}
        shiftId={editingShift?.id}
        initialValues={
          editingShift
            ? {
                name: editingShift.name,
                from: editingShift.from.slice(0, 5),
                to: editingShift.to.slice(0, 5),
              }
            : { name: "", from: "", to: "" }
        }
      />
    </Card>
  );
}
