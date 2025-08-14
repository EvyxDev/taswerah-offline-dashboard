import { useMutation } from "@tanstack/react-query";
import updateShift from "../_actions/update-shift";

export default function useUpdateShift() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: TUpdateShiftBody;
    }) => {
      const payload = await updateShift(id, data);
      if ("errors" in payload) {
        throw new Error(payload.message || "Error updating shift");
      }
      return payload;
    },
  });
  return { updateShift: mutate, isUpdating: isPending, updateError: error };
}
