"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import useGetInvoice from "../_hooks/use-get-invoice";
import { useSession } from "next-auth/react";
import usePrintConfirmation from "../_hooks/use-comfirm-print";

interface ReadyToPrintDialogProps {
  barcode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Skeleton component for loading state
const InvoiceSkeleton = () => {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
      <div className="space-y-4 sm:px-40">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
        <div className="border-t border-dashed border-[#bcbcbc] pt-4">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
        <div className="flex flex-wrap gap-4 justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-full w-32"></div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="h-12 bg-gray-200 rounded w-full sm:w-[40%]"></div>
        <div className="h-12 bg-gray-200 rounded w-full sm:w-[40%]"></div>
      </div>
    </div>
  );
};

// Error component for no invoice state
const NoInvoiceError = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
        <svg
          className="w-10 h-10 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="text-center space-y-2">
        <p className="text-[#6d7278] font-homenaje">
          There is no invoice available for this barcode yet. Please try again
          later.
        </p>
      </div>
      <button
        onClick={onClose}
        className="main-button flex justify-center items-center w-full sm:w-[40%]"
      >
        Close
      </button>
    </div>
  );
};

export default function ReadyToPrintDialog({
  barcode,
  onOpenChange,
  open,
}: ReadyToPrintDialogProps) {
  const { status, data } = useSession();
  const { printConfirmation } = usePrintConfirmation();
  const { invoice, isPending, error } = useGetInvoice(
    barcode,
    data?.token || ""
  );
  const t = useTranslations();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [step, setStep] = useState(1);

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setStep(1);
    }
  };

  const isLoading = status === "loading" || isPending;
  const hasError = error || !invoice;
  const handlePrint = () => {
    const sendData = {
      id: barcode,
      method: paymentMethod,
    };
    printConfirmation(sendData, {
      onSuccess: (data) => {
        console.log(data);
        setStep(2);
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-auto px-4 py-6 !max-w-[700px] w-full">
        {isLoading && <InvoiceSkeleton />}

        {!isLoading && hasError && (
          <NoInvoiceError onClose={() => handleClose(false)} />
        )}

        {!isLoading && !hasError && (
          <div className="space-y-10">
            {step === 1 && (
              <>
                {/* Order Summary */}
                <h3 className="text-center font-homenaje text-main-black text-3xl">
                  {t("readyToPrint.printConfirmation")}
                </h3>
                <div className="space-y-4 sm:px-40">
                  {[
                    {
                      label: t("readyToPrint.numOfPhotos"),
                      value: invoice?.num_photos || "15 photos",
                    },
                    {
                      label: t("readyToPrint.amount"),
                      value: invoice?.amount || "950 EGP",
                    },
                    {
                      label: t("readyToPrint.tax"),
                      value: invoice?.tax_amount || "50 EGP",
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center"
                    >
                      <span className="text-base text-[#6d7278] font-homenaje">
                        {label}
                      </span>
                      <span className="text-base font-homenaje font-medium text-black">
                        {value}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-[#bcbcbc] pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base text-[#6d7278] font-homenaje">
                        {t("readyToPrint.total")}
                      </span>
                      <span className="text-base font-homenaje font-bold text-black">
                        {invoice?.total_amount || "1000 EGP"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Payment Methods */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium font-homenaje text-center">
                    {t("readyToPrint.sendInvoiceVia")}
                  </h3>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="flex flex-wrap gap-4 justify-center"
                  >
                    {[
                      {
                        value: "creditcard",
                        label: t("readyToPrint.whatsapp"),
                      },
                      { value: "instapay", label: t("readyToPrint.print") },
                      { value: "cash", label: t("readyToPrint.both") },
                    ].map(({ value, label }) => (
                      <div
                        key={value}
                        className="relative bg-[#FAFAFA] flex-1 w-fit max-w-[140px] rounded-full h-10 flex items-center px-4 gap-4"
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
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center ">
                  <button
                    className="main-button flex justify-center items-center w-full sm:w-[40%] "
                    onClick={handlePrint}
                  >
                    {t("readyToPrint.printPhotos")}
                  </button>
                  <button
                    className=" main-button-border flex justify-center items-center text-center w-full sm:w-[40%] "
                    onClick={() => handleClose(false)}
                  >
                    {t("readyToPrint.cancel")}
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <div className="flex flex-col items-center justify-center  space-y-8">
                <h3 className="text-center font-homenaje text-main-black text-3xl">
                  {t("readyToPrint.sendSoftCopy")}
                </h3>
                <p className="text-center text-2xl text-[#6d7278] font-homenaje">
                  {t("readyToPrint.photosWillBeSent")} <br />
                  <span className="text-black">{"+01*******54"}</span>{" "}
                  {t("readyToPrint.within48Hours")}
                </p>
                <Image
                  src={"/assets/plane.png"}
                  alt="plane"
                  width={120}
                  height={120}
                />
                <button className="main-button flex justify-center items-center w-full sm:w-[40%] ">
                  {t("readyToPrint.sendNow")}
                </button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
