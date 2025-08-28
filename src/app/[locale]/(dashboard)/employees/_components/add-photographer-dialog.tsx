"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import AddOrEditPhotographerForm from "./add-or-edit-photographer-form";

export default function AddOrEditPhotographerDialog({
  edit = false,
  trigger,
  photoGrapher,
}: {
  edit?: boolean;
  photoGrapher?: PhGrapher;
  trigger?: React.ReactNode;
}) {
  const t = useTranslations("photographers");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="default"
            className="font-homenaje rtl:font-almarai text-lg main-button !w-[50px] !px-2 !py-0 !rounded-none"
          >
            <FaPlus className="!text-6xl" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="!max-w-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center text-4xl font-homenaje rtl:font-almarai font-normal mb-2">
            {edit ? t("editPhotographer") : t("addPhotographer")}
          </DialogTitle>
        </DialogHeader>
        <AddOrEditPhotographerForm
          edit={edit}
          onSuccess={() => setOpen(false)}
          photoGrapher={photoGrapher}
        />
      </DialogContent>
    </Dialog>
  );
}
