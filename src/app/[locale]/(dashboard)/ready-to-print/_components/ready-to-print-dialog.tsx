"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { SendPhotosAction } from "../_actoin/send-photos";

interface ReadyToPrintDialogProps {
  barcode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReadyToPrintDialog({
  barcode,
  onOpenChange,
  open,
}: ReadyToPrintDialogProps) {
  const t = useTranslations();
  const [submitting, setSubmitting] = useState(false);

  const handleClose = (open: boolean) => {
    onOpenChange(open);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await SendPhotosAction(barcode, "print");
      handleClose(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-auto px-4 py-6 !max-w-[700px] w-full">
        <div className="space-y-10">
          <h3 className="text-center font-homenaje rtl:font-almarai text-main-black text-3xl">
            {t("readyToPrint.printConfirmation")}
          </h3>

          <div className="flex flex-col items-center justify-center space-y-6 py-2">
            <Image
              src={"/assets/plane.png"}
              alt="plane"
              width={120}
              height={120}
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center ">
            <button
              className="main-button flex justify-center items-center w-full sm:w-[40%] "
              onClick={handleConfirm}
              disabled={submitting}
            >
              {submitting
                ? t("payment.processing")
                : t("readyToPrint.printPhotos")}
            </button>
            <button
              className=" main-button-border flex justify-center items-center text-center w-full sm:w-[40%] "
              onClick={() => handleClose(false)}
            >
              {t("readyToPrint.cancel")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
