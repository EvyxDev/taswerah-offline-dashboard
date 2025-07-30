"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreditCard, X, QrCode, DollarSign } from "lucide-react";
import { UpdateInvoiceTotal } from "../_action/update-Invoice-total";

type PayDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  barcode: string | null;
};

const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
});

type FormData = z.infer<typeof formSchema>;

export function PayDialog({ isOpen, onClose, barcode }: PayDialogProps) {
  const t = useTranslations();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsProcessing(true);

    try {
      const result = await UpdateInvoiceTotal(
        barcode!,
        parseFloat(data.amount)
      );
      console.log("Payment processed successfully:", result);

      form.reset();
      onClose();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!barcode) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] font-homenaje">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-homenaje text-foreground">
              {t("payment.title")}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-muted-foreground">
            {t("payment.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="py-4">
              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <QrCode className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700 font-homenaje">
                    {t("order.code") || "Order Code"}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-[#535862] text-white font-homenaje text-lg px-3 py-1"
                >
                  {barcode}
                </Badge>
              </div>

              {/* Amount Input */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 font-homenaje">
                      {t("payment.amount")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-10 font-homenaje text-lg h-12"
                          min="0"
                          step="0.01"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="font-homenaje"
                disabled={isProcessing}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-[#535862] hover:bg-[#424751] text-white font-homenaje flex items-center gap-2"
                disabled={isProcessing}
              >
                <CreditCard className="w-4 h-4" />
                {isProcessing ? t("payment.processing") : t("payment.payNow")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
