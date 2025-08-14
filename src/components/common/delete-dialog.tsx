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

type DeleteDialogProps = {
  title: string;
  description: string;
  action: () => void;
  children: React.ReactNode; // trigger
};

export default function DeleteDialog({
  title,
  description,
  action,
  children,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const onConfirm = () => {
    setPending(true);
    try {
      action();
      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px] text-center font-homenaje">
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
              className="font-homenaje"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={pending}
              className="bg-red-600 hover:bg-red-700 text-white font-homenaje"
            >
              {pending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
