/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import generateBarcodes from "../_actions/generate-barcodes";

export default function useGenerateBarcodes() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ quantity }: { quantity: number }) => {
      if (!quantity || quantity <= 0) throw new Error("Quantity must be > 0");
      const payload = await generateBarcodes(quantity);
      if ((payload as any)?.errors) {
        throw new Error("Error generating barcodes");
      }
      return payload;
    },
  });

  return {
    generate: mutate,
    generating: isPending,
    generateError: error,
  };
}
