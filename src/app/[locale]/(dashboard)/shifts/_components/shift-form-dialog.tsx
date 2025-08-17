"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useCreateShift from "../_hooks/use-create-shift";
import useUpdateShift from "../_hooks/use-update-shift";
import { useTranslations } from "next-intl";

const shiftSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  from: z.string().regex(/^\d{2}:\d{2}$/i, "From time must be HH:mm"),
  to: z.string().regex(/^\d{2}:\d{2}$/i, "To time must be HH:mm"),
});

export type ShiftFormValues = z.infer<typeof shiftSchema>;

type Props = {
  open: boolean;
  onOpenChange: () => void;
  initialValues?: ShiftFormValues;
  mode: "create" | "edit";
  shiftId?: number | string;
};

export default function ShiftFormDialog({
  open,
  onOpenChange,
  initialValues,
  mode,
  shiftId,
}: Props) {
  const router = useRouter();
  const { addShift, isAdding } = useCreateShift();
  const { updateShift, isUpdating } = useUpdateShift();
  const t = useTranslations();

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftSchema),
    defaultValues: initialValues || { name: "", from: "", to: "" },
    values: initialValues || { name: "", from: "", to: "" },
  });

  const submitting = isAdding || isUpdating;
  const title =
    mode === "edit" ? t("shifts.edit_title") : t("shifts.create_title");

  const onSubmit = (values: ShiftFormValues) => {
    if (mode === "edit" && shiftId != null) {
      updateShift(
        {
          id: shiftId,
          data: { name: values.name, from: values.from, to: values.to },
        },
        {
          onSuccess: () => {
            toast.success("Shift updated");
            onOpenChange();
            router.refresh();
          },
          onError: (e: unknown) =>
            toast.error((e as Error)?.message || "Update failed"),
        }
      );
    } else {
      addShift(
        { name: values.name, from: values.from, to: values.to },
        {
          onSuccess: () => {
            toast.success("Shift created");
            onOpenChange();
            router.refresh();
          },
          onError: (e: unknown) =>
            toast.error((e as Error)?.message || "Create failed"),
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] font-homenaje">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    {t("shifts.name")}
                  </FormLabel>
                  <FormControl>
                    <Input className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      {t("shifts.from")}
                    </FormLabel>
                    <FormControl>
                      <Input type="time" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      {t("shifts.to")}
                    </FormLabel>
                    <FormControl>
                      <Input type="time" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onOpenChange}
                className="font-homenaje"
                disabled={submitting}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="main-button text-white font-homenaje"
              >
                {submitting ? t("shifts.saving") : t("shifts.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
