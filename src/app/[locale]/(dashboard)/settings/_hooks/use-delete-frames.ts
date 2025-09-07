import { useMutation } from "@tanstack/react-query";
import deleteFrames from "../actions/delete-frames";

export default function useDeleteFrames() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ ids }: { ids: Array<number | string> }) => {
      const payload = await deleteFrames(ids);
      if ("errors" in payload) {
        throw new Error("Error deleting frames");
      }
      return payload;
    },
  });

  return {
    DeleteFrames: mutate,
    DeleteFramesPending: isPending,
    DeleteFramesError: error,
  };
}
