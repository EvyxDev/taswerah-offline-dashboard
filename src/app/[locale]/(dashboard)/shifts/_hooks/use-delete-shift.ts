import { useMutation } from "@tanstack/react-query";
import deleteShift from "../_actions/delete-shift";

export default function useDeleteShift() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (id: number | string) => {
      const payload = await deleteShift(id);
      if ("errors" in payload) {
        throw new Error(payload.message || "Error deleting shift");
      }
      return payload;
    },
  });
  return { deleteShift: mutate, isDeleting: isPending, deleteError: error };
}
