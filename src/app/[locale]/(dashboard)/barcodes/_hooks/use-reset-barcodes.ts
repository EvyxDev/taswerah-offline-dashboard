/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import resetBarcodes from "../_actions/reset-barcodes";

export default function useResetBarcodes() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const payload = await resetBarcodes();
      if ((payload as any)?.errors) {
        throw new Error("Error generating barcodes");
      }
      return payload;
    },
  });

  return {
    Reset: mutate,
    Reseting: isPending,
    ResetError: error,
  };
}
