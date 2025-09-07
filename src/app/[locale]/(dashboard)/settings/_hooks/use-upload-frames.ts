import { useMutation } from "@tanstack/react-query";
import uploadFrames from "../actions/upload-frames";

export default function useUploadFrames() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      const formData = new FormData();
      for (const file of files) {
        formData.append("photos[]", file);
      }

      const payload = await uploadFrames(formData);
      if ("errors" in payload) {
        throw new Error("Error uploading frames");
      }
      return payload;
    },
  });

  return {
    UploadFrames: mutate,
    UploadFramesPending: isPending,
    UploadFramesError: error,
  };
}
