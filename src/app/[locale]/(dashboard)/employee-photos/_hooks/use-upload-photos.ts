import { useMutation } from "@tanstack/react-query";
import { uploadPhotosAction } from "../_actions/upload-photos";

interface UploadPhotosData {
  photos: File[];
  barcodePrefix: string;
  employeeId: string;
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
      formData.append("employee_id", data.employeeId);

      const result = await uploadPhotosAction(formData, data.employeeId);

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      return result;
    },
    onSuccess: (data) => {
      // Show success message
      alert(data.message || "Photos uploaded successfully!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      // Show error message
      alert(error.message || "Failed to upload photos");
      onError?.(error.message);
    },
  });
};
