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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreditCard, X, QrCode, DollarSign } from "lucide-react";
import useSubmitOrder from "../_hooks/use-submit-order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SendPhotosAction } from "../../ready-to-print/_actoin/send-photos";

type PayDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  barcode: string | null;
  orderId: number | null;
  shifts: TShift[];
};

const formSchema = z.object({
  pay_amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  shift_id: z.string().min(1, "Shift is required"),
});

type FormData = z.infer<typeof formSchema>;

export function PayDialog({
  isOpen,
  onClose,
  barcode,
  orderId,
  shifts,
}: PayDialogProps) {
  const t = useTranslations();
  const { submitOrder, isSubmitting } = useSubmitOrder();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { pay_amount: "", shift_id: "" },
  });

  const onSubmit = (data: FormData) => {
    submitOrder(
      {
        orderId: orderId!,
        shift_id: Number(data.shift_id),
        pay_amount: parseFloat(data.pay_amount),
      },
      {
        onSuccess: async () => {
          toast.success("Payment submitted");
          const result = await SendPhotosAction(
            barcode || "",
            "print_and_send"
          );
          console.log(result);
          form.reset();
          onClose();
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Payment failed";
          toast.error(message);
        },
      }
    );
  };
  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!barcode || !orderId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] font-homenaje rtl:font-almarai">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-homenaje rtl:font-almarai text-foreground">
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
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <QrCode className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700 font-homenaje rtl:font-almarai">
                    {t("order.code") || "Order Code"}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-[#535862] text-white font-homenaje rtl:font-almarai text-lg px-3 py-1"
                >
                  {barcode}
                </Badge>
              </div>

              <FormField
                control={form.control}
                name="shift_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 font-homenaje rtl:font-almarai">
                      {t("shifts.label", { default: "Shift" })}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="font-homenaje rtl:font-almarai h-12">
                          <SelectValue
                            placeholder={t("shifts.select_placeholder", {
                              default: "Select a shift",
                            })}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shifts.map((s) => (
                          <SelectItem
                            key={s.id}
                            value={String(s.id)}
                            className="font-homenaje rtl:font-almarai"
                          >
                            <span className="font-medium">
                              {s.name} ({s.from.slice(0, 5)} -{" "}
                              {s.to.slice(0, 5)})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pay_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 font-homenaje rtl:font-almarai">
                      {t("payment.amount")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-10 font-homenaje rtl:font-almarai text-lg h-12"
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
                className="font-homenaje rtl:font-almarai"
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-[#535862] hover:bg-[#424751] text-white font-homenaje rtl:font-almarai flex items-center gap-2"
                disabled={isSubmitting}
              >
                <CreditCard className="w-4 h-4" />
                {isSubmitting ? t("payment.processing") : t("payment.payNow")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
