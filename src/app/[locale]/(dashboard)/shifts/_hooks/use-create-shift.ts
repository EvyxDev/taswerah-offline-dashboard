import { useMutation } from "@tanstack/react-query";
import createShift from "../_actions/create-shift";

export default function useCreateShift() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: TCreateShiftBody) => {
      const payload = await createShift(data);
      if ("errors" in payload) {
        throw new Error(payload.message || "Error creating shift");
      }
      return payload;
    },
  });
  return { addShift: mutate, isAdding: isPending, addError: error };
}
