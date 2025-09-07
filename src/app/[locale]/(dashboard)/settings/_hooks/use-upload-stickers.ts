import { useMutation } from "@tanstack/react-query";
import uploadStickers from "../actions/upload-stickers";

export default function useUploadStickers() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      const formData = new FormData();
      for (const file of files) {
        formData.append("photos[]", file);
      }

      const payload = await uploadStickers(formData);
      if ("errors" in payload) {
        throw new Error("Error uploading stickers");
      }
      return payload;
    },
  });

  return {
    UploadStickers: mutate,
    UploadStickersPending: isPending,
    UploadStickersError: error,
  };
}
