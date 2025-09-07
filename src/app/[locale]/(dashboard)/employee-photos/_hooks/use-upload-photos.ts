import { useMutation } from "@tanstack/react-query";
import { uploadPhotosAction } from "../_actions/upload-photos";

interface UploadPhotosData {
  photos: File[];
  barcodePrefix: string;
  employeeIds: number[];
}

interface UseUploadPhotosOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useUploadPhotos = ({
  onSuccess,
  onError,
}: UseUploadPhotosOptions = {}) => {
  return useMutation({
    mutationFn: async (data: UploadPhotosData) => {
      // Create FormData on the client side
      const formData = new FormData();

      // Append each photo
      data.photos.forEach((file) => {
        formData.append("photos[]", file);
      });

      formData.append("barcode_prefix", data.barcodePrefix);

      data.employeeIds.forEach((employeeId) => {
        formData.append("employee_ids[]", employeeId.toString());
      });
      const result = await uploadPhotosAction(formData);

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
