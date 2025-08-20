import { useMutation } from "@tanstack/react-query";
import deletePhotographer from "../_actions/delete-photographer";

export default function useDeleteEmployeer() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const payload = await deletePhotographer(id);
      if ("errors" in payload) {
        throw new Error("Error deleting employee");
      }
      return payload;
    },
  });

  return {
    DeleteEmployeer: mutate,
    DeletePending: isPending,
    DeleteError: error,
  };
}
