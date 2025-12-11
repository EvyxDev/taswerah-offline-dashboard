import { useRef, useCallback } from "react";
import { uploadSinglePhotoAction } from "../_actions/upload-single-photo";
import imageCompression from "browser-image-compression";

interface UploadSinglePhotoData {
  photo: File;
  compressedPhoto: File;
  barcodePrefix: string;
  employeeIds: number[];
}

interface UseUploadSinglePhotoOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UploadQueueItem {
  data: UploadSinglePhotoData;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export const useUploadSinglePhoto = ({
  onSuccess,
  onError,
}: UseUploadSinglePhotoOptions = {}) => {
  const queueRef = useRef<UploadQueueItem[]>([]);
  const isProcessingRef = useRef(false);

  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || queueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;

    while (queueRef.current.length > 0) {
      const item = queueRef.current.shift();
      if (!item) break;
      console.log(item);

      try {
        const formData = new FormData();
        formData.append("photo", item.data.photo);
        formData.append("photo_compressed", item.data.compressedPhoto);
        formData.append("barcode_prefix", item.data.barcodePrefix);

        item.data.employeeIds.forEach((employeeId) => {
          formData.append("employee_id", employeeId.toString());
        });

        const result = await uploadSinglePhotoAction(formData);

        if (!result.success) {
          throw new Error(result.error || "Upload failed");
        }

        item.onSuccess();
      } catch (error) {
        item.onError(error as Error);
      }

      // delay
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    isProcessingRef.current = false;
  }, []);

  const mutate = useCallback(
    async (
      data: UploadSinglePhotoData,
      callbacks?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        // 1) compress image
        const compressed = await imageCompression(data.photo, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        console.log(compressed);

        // 2) Add both original + compressed into queue
        const queueItem: UploadQueueItem = {
          data: {
            ...data,
            photo: data.photo,
            compressedPhoto: compressed,
          },
          onSuccess: () => {
            callbacks?.onSuccess?.();
            onSuccess?.();
          },
          onError: (error: Error) => {
            callbacks?.onError?.(error);
            onError?.(error.message);
          },
        };

        queueRef.current.push(queueItem);

        if (!isProcessingRef.current) {
          processQueue();
        }
      } catch (err) {
        callbacks?.onError?.(err as Error);
        onError?.((err as Error).message);
      }
    },
    [processQueue, onSuccess, onError]
  );

  const clearQueue = useCallback(() => {
    queueRef.current = [];
    isProcessingRef.current = false;
  }, []);

  return {
    mutate,
    clearQueue,
    isLoading: isProcessingRef.current,
  };
};
