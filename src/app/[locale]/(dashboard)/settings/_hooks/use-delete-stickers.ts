import { useMutation } from "@tanstack/react-query";
import deleteStickers from "../actions/delete-stickers";

export default function useDeleteStickers() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ ids }: { ids: Array<number | string> }) => {
      const payload = await deleteStickers(ids);
      if ("errors" in payload) {
        throw new Error("Error deleting stickers");
      }
      return payload;
    },
  });

  return {
    DeleteStickers: mutate,
    DeleteStickersPending: isPending,
    DeleteStickersError: error,
  };
}
