import { useMutation } from "@tanstack/react-query";
import { uploadSinglePhotoAction } from "../_actions/upload-single-photo";

interface UploadSinglePhotoData {
  photo: File;
  barcodePrefix: string;
  employeeIds: number[];
}

interface UseUploadSinglePhotoOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useUploadSinglePhoto = ({
  onSuccess,
  onError,
}: UseUploadSinglePhotoOptions = {}) => {
  return useMutation({
    mutationFn: async (data: UploadSinglePhotoData) => {
      // Create FormData on the client side
      const formData = new FormData();

      // Append the photo
      formData.append("photo", data.photo);

      formData.append("barcode_prefix", data.barcodePrefix);

      data.employeeIds.forEach((employeeId) => {
        formData.append("employee_ids[]", employeeId.toString());
      });

      const result = await uploadSinglePhotoAction(formData);

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      return result;
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error.message);
    },
  });
};
