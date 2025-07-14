import { useMutation } from "@tanstack/react-query";
import { PrintConfirmation } from "../_actoin/print-confirmation";

export default function usePrintConfirmation() {
  // Mutation
  const { isPending, error, mutate } = useMutation({
    mutationFn: ({ id, method }: { id: string; method: string }) =>
      PrintConfirmation(id, method),
  });

  return {
    isPending,
    error,
    printConfirmation: mutate,
  };
}
