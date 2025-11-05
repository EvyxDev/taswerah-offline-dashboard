"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { SendPhotosAction } from "../_actoin/send-photos";
import { CancelOrderAction } from "../../orders/_action/cancel-order";
import { toast } from "sonner";

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
  const [cancelling, setCancelling] = useState(false);

  const handleClose = (open: boolean) => {
    onOpenChange(open);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await SendPhotosAction(barcode, "print");
      if (res?.success) {
        toast.success(
          t("readyToPrint.printSuccess", {
            default: "Print Successful!",
          }) as string
        );
        handleClose(false);
      } else {
        toast.error(
          res?.message ||
            (t("readyToPrint.printError", {
              default: "Failed to print",
            }) as string)
        );
      }
    } catch (error) {
      const message =
        (error as { message?: string })?.message ||
        (t("readyToPrint.printError", {
          default: "Failed to print",
        }) as string);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const res = await CancelOrderAction(barcode);
      if (res?.success) {
        toast.success(
          t("order.cancelSuccess", { default: "Order cancelled" }) as string
        );
        handleClose(false);
      } else {
        toast.error(
          res?.message ||
            (t("order.cancelError", { default: "Failed to cancel" }) as string)
        );
      }
    } catch (error) {
      const message =
        (error as { message?: string })?.message ||
        (t("order.cancelError", { default: "Failed to cancel" }) as string);
      toast.error(message);
    } finally {
      setCancelling(false);
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
              className="main-button flex justify-center items-center bg-red-600 hover:bg-red-700 text-white w-full sm:w-[40%] "
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling
                ? (t("order.cancelling", {
                    default: "Cancelling...",
                  }) as string)
                : (t("order.cancelOrder", {
                    default: "Cancel Order",
                  }) as string)}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
