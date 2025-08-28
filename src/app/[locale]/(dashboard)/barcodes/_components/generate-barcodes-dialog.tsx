"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import useGenerateBarcodes from "../_hooks/use-generate-barcodes";
import { toast } from "sonner";

export default function GenerateBarcodesDialog() {
  const t = useTranslations("barcodes");
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const { generate, generating } = useGenerateBarcodes();

  const onSubmit = () => {
    generate(
      { quantity },
      {
        onSuccess: () => {
          toast.success(t("generated", { default: "Barcodes generated" }));
          setOpen(false);
        },
        onError: () => {
          toast.error(t("generate_error", { default: "Failed to generate" }));
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="font-homenaje rtl:font-almarai text-lg main-button !w-[50px] !px-2 !py-0 !rounded-none"
        >
          <FaPlus className="!text-6xl" />
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center text-3xl font-homenaje rtl:font-almarai font-normal mb-2">
            {t("generate_title", { default: "Generate Barcodes" })}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <label className="font-homenaje rtl:font-almarai text-lg">
            {t("quantity", { default: "Quantity" })}
          </label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <div className="flex justify-center w-full mt-5 items-center">
            <Button
              className="main-button !py-7"
              type="button"
              variant="default"
              disabled={generating || quantity <= 0}
              onClick={onSubmit}
            >
              {generating
                ? t("generating", { default: "Generating..." })
                : t("generate", { default: "Generate" })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
