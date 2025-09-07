"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ResetBarcodesDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  pending?: boolean;
  disabled?: boolean;
  children: React.ReactNode; // trigger
};

export default function ResetBarcodesDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  pending,
  disabled,
  children,
}: ResetBarcodesDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <span onClick={() => !disabled && setOpen(true)}>{children}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px] text-center font-homenaje rtl:font-almarai">
          <DialogHeader>
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            <DialogDescription className="text-gray-500">
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-center gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="font-homenaje rtl:font-almarai"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={pending}
              className="bg-red-600 hover:bg-red-700 text-white font-homenaje rtl:font-almarai"
            >
              {pending ? "Processing..." : confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
