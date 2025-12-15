import { useRef, useCallback, useState } from "react";
import { uploadSinglePhotoAction } from "../_actions/upload-single-photo";
import imageCompression from "browser-image-compression";

interface UploadSinglePhotoData {
  photo: File;
  compressedPhoto: File;
  barcodePrefix: string;
  employeeId: number;
}

interface UseUploadSinglePhotoOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UploadQueueItem {
  data: Omit<UploadSinglePhotoData, "compressedPhoto"> & { photo: File };
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export const useUploadSinglePhoto = ({
  onSuccess,
  onError,
}: UseUploadSinglePhotoOptions = {}) => {
  const queueRef = useRef<UploadQueueItem[]>([]);
  const activeCountRef = useRef(0);
  const [queueLength, setQueueLength] = useState(0);
  const [activeUploads, setActiveUploads] = useState(0);

  const MAX_CONCURRENT_UPLOADS = 6;

  const uploadNext = useCallback(async () => {
    if (
      queueRef.current.length === 0 ||
      activeCountRef.current >= MAX_CONCURRENT_UPLOADS
    ) {
      return;
    }

    const item = queueRef.current.shift()!;
    activeCountRef.current++;
    setActiveUploads(activeCountRef.current);
    setQueueLength(queueRef.current.length);

    try {
      // Compress image
      const compressed = await imageCompression(item.data.photo, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true, // Offloads to worker — very important!
      });

      // Prepare FormData
      const formData = new FormData();
      formData.append("photo", item.data.photo);
      formData.append("photo_compressed", compressed);
      formData.append("barcode_prefix", item.data.barcodePrefix);

      formData.append("employee_id", item.data.employeeId.toString());

      // Upload
      const result = await uploadSinglePhotoAction(formData);

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      item.onSuccess();
      onSuccess?.();
    } catch (err) {
      const error = err as Error;
      item.onError(error);
      onError?.(error.message);
    } finally {
      activeCountRef.current--;
      setActiveUploads(activeCountRef.current);
      setQueueLength(queueRef.current.length);

      // Continue processing next items
      uploadNext();
    }
  }, [onSuccess, onError]);

  const mutate = useCallback(
    (
      data: Omit<UploadSinglePhotoData, "compressedPhoto">,
      callbacks?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      }
    ) => {
      const queueItem: UploadQueueItem = {
        data: {
          photo: data.photo,
          barcodePrefix: data.barcodePrefix,
          employeeId: data.employeeId,
        },
        onSuccess: callbacks?.onSuccess || (() => {}),
        onError: callbacks?.onError || (() => {}),
      };

      queueRef.current.push(queueItem);
      setQueueLength(queueRef.current.length);

      // Trigger as many parallel uploads as allowed
      while (
        activeCountRef.current < MAX_CONCURRENT_UPLOADS &&
        queueRef.current.length > 0
      ) {
        uploadNext();
      }
    },
    [uploadNext]
  );

  const clearQueue = useCallback(() => {
    queueRef.current = [];
    setQueueLength(0);
  }, []);

  return {
    mutate,
    clearQueue,
    isLoading: activeCountRef.current > 0 || queueRef.current.length > 0,
    queueLength,
    activeUploads, // Optional: show "Uploading 6/100..." in UI
  };
};
