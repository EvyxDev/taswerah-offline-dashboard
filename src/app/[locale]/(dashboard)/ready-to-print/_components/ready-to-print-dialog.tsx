/* eslint-disable @next/next/no-img-element */
"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { SendPhotosAction } from "../_actoin/send-photos";
import { toast } from "sonner";

interface ReadyToPrintDialogProps {
  barcode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SendPhotosData = {
  data?: {
    order?: {
      share_link?: string;
    };
  };
  success?: boolean;
  message?: string;
};

export default function ReadyToPrintDialog({
  barcode,
  onOpenChange,
  open,
}: ReadyToPrintDialogProps) {
  const t = useTranslations();
  const [sendType, setSendType] = useState<"send" | "print" | "print_and_send">(
    "send"
  );
  const [submitting, setSubmitting] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setSendType("send");
      setShareLink(null);
    }
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const payload = (await SendPhotosAction(
        barcode,
        sendType
      )) as unknown as SendPhotosData;
      if (payload && payload.success === false) {
        throw new Error(payload.message || "Failed");
      }
      const link = payload?.data?.order?.share_link;
      if (link) {
        setShareLink(link);
      }
      toast.success("Request submitted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-auto px-4 py-6 !max-w-[700px] w-full">
        {!shareLink ? (
          <div className="space-y-10">
            <h3 className="text-center font-homenaje text-main-black text-3xl">
              {t("readyToPrint.printConfirmation")}
            </h3>

            <div className="space-y-4">
              <h3 className="text-lg font-medium font-homenaje text-center">
                {t("readyToPrint.sendInvoiceVia")}
              </h3>
              <RadioGroup
                value={sendType}
                onValueChange={(val: "send" | "print" | "print_and_send") =>
                  setSendType(val)
                }
                className="flex flex-wrap gap-4 justify-center"
              >
                {[
                  { value: "send", label: "Send" },
                  { value: "print", label: t("readyToPrint.print") },
                  { value: "print_and_send", label: t("readyToPrint.both") },
                ].map(({ value, label }) => (
                  <div
                    key={value}
                    className="relative bg-[#FAFAFA] flex-1 w-fit max-w-[180px] rounded-full h-10 flex items-center px-4 gap-4"
                  >
                    <RadioGroupItem
                      value={value}
                      id={value}
                      className="text-[#6d7278] z-10 flex-shrink-0"
                    />
                    <Label
                      htmlFor={value}
                      className="text-sm text-[#6d7278] cursor-pointer"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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

            <div className="flex flex-col items-center justify-center space-y-6 py-2">
              <Image
                src={"/assets/plane.png"}
                alt="plane"
                width={120}
                height={120}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col items-center">
            <h3 className="text-center font-homenaje text-main-black text-2xl">
              Scan to open shared photos
            </h3>
            <div className="bg-white p-4 rounded-lg shadow">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  shareLink
                )}`}
                alt="QR code"
                width={180}
                height={180}
              />
            </div>
            <p className="text-sm text-gray-500 break-all text-center max-w-[90%]">
              {shareLink}
            </p>
            <div className="flex gap-3">
              <button
                className="main-button-border px-4 py-2 rounded"
                onClick={() => window.open(shareLink!, "_blank")}
              >
                Open link
              </button>
              <button
                className="main-button px-4 py-2 rounded"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareLink!);
                    toast.success("Link copied");
                  } catch {
                    toast.error("Copy failed");
                  }
                }}
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
