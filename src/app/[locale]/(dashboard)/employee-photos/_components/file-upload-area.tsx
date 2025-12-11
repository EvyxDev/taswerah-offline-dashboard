/* eslint-disable @next/next/no-img-element */
import { useCallback, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FiX, FiFolder } from "react-icons/fi";
import { useUploadSinglePhoto } from "../_hooks/use-upload-single-photo";
import imageCompression from "browser-image-compression";

interface SelectedFile {
  file: File;
  preview: string;
  uploadStatus?: "idle" | "uploading" | "success" | "error";
  uploadError?: string;
}

interface ImageUploaderProps {
  selectedFiles: SelectedFile[];
  onFilesChange: (files: SelectedFile[]) => void;
  onError?: (error: string) => void;
  onFolderNameChange?: (folderName: string | null) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSizePerFile?: number;
  acceptedFormats?: string[];
  employeeIds?: number[];
  autoUpload?: boolean;
}

export default function ImageUploader({
  selectedFiles,
  onFilesChange,
  onError,
  onFolderNameChange,
  disabled = false,
  acceptedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
  ],
  employeeIds = [],
  autoUpload = true,
}: ImageUploaderProps) {
  const [processingProgress, setProcessingProgress] = useState<{
    total: number;
    processed: number;
  } | null>(null);

  const [uploadProgress, setUploadProgress] = useState<{
    total: number;
    uploaded: number;
    failed: number;
  } | null>(null);

  const filesRef = useRef<SelectedFile[]>(selectedFiles);
  const pendingUpdatesRef = useRef<SelectedFile[]>([]);
  const flushUpdates = useCallback(() => {
    if (pendingUpdatesRef.current.length > 0) {
      filesRef.current = [...filesRef.current, ...pendingUpdatesRef.current];
      onFilesChange(filesRef.current);
      pendingUpdatesRef.current = [];
    }
  }, [onFilesChange]);

  const uploadMutation = useUploadSinglePhoto({
    onError: (error) => onError?.(error),
  });

  const detectTopLevelFolderName = useCallback((files: File[]) => {
    for (const file of files) {
      const relativePath = file.webkitRelativePath;
      if (relativePath) {
        const first = relativePath.split("/")[0];
        if (first) return first;
      }
    }
    return null;
  }, []);

  const validateFiles = useCallback((files: File[]) => {
    return { validFiles: files, errors: [] };
  }, []);

  const processFiles = useCallback(
    (files: File[], forcedFolder?: string | null) => {
      if (!files.length) {
        onError?.("Please select at least one image file");
        return;
      }

      const folder = forcedFolder ?? detectTopLevelFolderName(files);
      if (!folder) {
        onFolderNameChange?.(null);
        return;
      }

      if (folder.length < 5) {
        onError?.("Folder name must have at least 5 characters");
        onFolderNameChange?.(null);
        return;
      }

      const barcodePrefix = folder.slice(-5);
      onFolderNameChange?.(barcodePrefix);

      const { validFiles, errors } = validateFiles(files);
      if (errors.length > 0) onError?.(errors.join(", "));
      if (!validFiles.length) return;

      const total = validFiles.length;
      setProcessingProgress({ total, processed: 0 });
      if (autoUpload && employeeIds.length) {
        setUploadProgress({ total, uploaded: 0, failed: 0 });
      }

      // Sequential processing with concurrency limit
      const maxConcurrent = 3;
      let activeCount = 0;
      let index = 0;

      const processNext = () => {
        if (index >= total) return;
        if (activeCount >= maxConcurrent) return;

        while (activeCount < maxConcurrent && index < total) {
          const file = validFiles[index];
          // const fileIndex = index;
          index++;
          activeCount++;

          const selectedFile: SelectedFile = {
            file,
            preview: URL.createObjectURL(file),
            uploadStatus: "idle",
          };
          pendingUpdatesRef.current.push(selectedFile);
          flushUpdates();

          setProcessingProgress((p) =>
            p ? { ...p, processed: p.processed + 1 } : p
          );

          if (autoUpload && employeeIds.length && barcodePrefix) {
            (async () => {
              try {
                const compressed = await imageCompression(file, {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 1920,
                  useWebWorker: true,
                });

                // Mark uploading
                const listUploading = [...filesRef.current];
                const idx = listUploading.findIndex(
                  (f) => f.preview === selectedFile.preview
                );
                if (idx !== -1) listUploading[idx].uploadStatus = "uploading";
                onFilesChange(listUploading);

                uploadMutation.mutate(
                  {
                    photo: file,
                    compressedPhoto: compressed,
                    barcodePrefix,
                    employeeIds,
                  },
                  {
                    onSuccess: () => {
                      const list = [...filesRef.current];
                      const idx = list.findIndex(
                        (f) => f.preview === selectedFile.preview
                      );
                      if (idx !== -1) {
                        list[idx].uploadStatus = "success";
                        list[idx].uploadError = undefined;
                      }
                      onFilesChange(list);

                      setUploadProgress((p) =>
                        p ? { ...p, uploaded: p.uploaded + 1 } : p
                      );
                      activeCount--;
                      processNext();
                    },
                    onError: (err: Error) => {
                      const list = [...filesRef.current];
                      const idx = list.findIndex(
                        (f) => f.preview === selectedFile.preview
                      );
                      if (idx !== -1) {
                        list[idx].uploadStatus = "error";
                        list[idx].uploadError = err.message;
                      }
                      onFilesChange(list);

                      setUploadProgress((p) =>
                        p ? { ...p, failed: p.failed + 1 } : p
                      );
                      activeCount--;
                      processNext();
                    },
                  }
                );
              } catch (err: unknown) {
                if (err instanceof Error) {
                  onError?.(`Compression failed: ${err.message}`);
                } else {
                  onError?.("Compression failed");
                }
                activeCount--;
                processNext();
              }
            })();
          } else {
            activeCount--;
            processNext();
          }
        }
      };

      processNext();
    },
    [
      employeeIds,
      flushUpdates,
      autoUpload,
      detectTopLevelFolderName,
      validateFiles,
      uploadMutation,
      onError,
      onFilesChange,
      onFolderNameChange,
    ]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      processFiles(files);
      e.target.value = "";
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const temp = [...filesRef.current];
      URL.revokeObjectURL(temp[index].preview);
      temp.splice(index, 1);
      filesRef.current = temp;
      onFilesChange(temp);
    },
    [onFilesChange]
  );

  const clearAllFiles = useCallback(() => {
    uploadMutation.clearQueue();
    filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview));
    filesRef.current = [];
    onFilesChange([]);
    onFolderNameChange?.(null);
    setProcessingProgress(null);
    setUploadProgress(null);
  }, [onFilesChange, onFolderNameChange, uploadMutation]);

  const imageGrid = useMemo(() => {
    return selectedFiles.map((file, index) => {
      const border =
        file.uploadStatus === "uploading"
          ? "border-yellow-400"
          : file.uploadStatus === "success"
          ? "border-green-400"
          : file.uploadStatus === "error"
          ? "border-red-400"
          : "border-gray-200";

      return (
        <div key={index} className="relative group">
          <div
            className={`aspect-square overflow-hidden rounded-lg border-2 ${border} hover:border-blue-300 transition`}
          >
            <img
              src={file.preview}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />

            {file.uploadStatus === "uploading" && (
              <div className="absolute top-1 left-1 bg-yellow-500 text-white rounded-full p-1">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {file.uploadStatus === "success" && (
              <div className="absolute top-1 left-1 bg-green-500 text-white rounded-full p-1">
                ✓
              </div>
            )}

            {file.uploadStatus === "error" && (
              <div className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1">
                ✕
              </div>
            )}
          </div>

          <button
            onClick={() => removeFile(index)}
            disabled={disabled}
            className="absolute -top-0 -right-0 bg-red-500 text-white rounded-full p-.5 opacity-0 group-hover:opacity-100 transition shadow-md"
          >
            <FiX size={14} />
          </button>

          {file.uploadError && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 truncate">
              {file.uploadError}
            </div>
          )}
        </div>
      );
    });
  }, [selectedFiles, disabled, removeFile]);

  return (
    <div className="space-y-4">
      {/* Folder Picker */}
      <div className="grid grid-cols-1 gap-4">
        <div className="relative">
          <input
            type="file"
            multiple
            accept={acceptedFormats.join(",")}
            onChange={handleFileSelect}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            {...{
              webkitdirectory: "",
              directory: "",
            }}
          />

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition">
            <FiFolder size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Select Entire Folder
            </p>
            <p className="text-xs text-gray-500">
              Folder last 5 chars = barcode prefix
            </p>
          </div>
        </div>
      </div>

      {processingProgress && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>
              Processing images: {processingProgress.processed} /{" "}
              {processingProgress.total}
            </span>
          </div>
          <Progress
            value={
              (processingProgress.processed / processingProgress.total) * 100
            }
            className="h-2"
          />
        </div>
      )}

      {uploadProgress && uploadProgress.total > 0 && (
        <div className="space-y-2">
          <Progress
            value={(uploadProgress.uploaded / uploadProgress.total) * 100}
            className="h-2"
          />
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {imageGrid}
      </div>

      <Button
        variant="destructive"
        onClick={clearAllFiles}
        disabled={disabled || selectedFiles.length === 0}
      >
        Clear All
      </Button>
    </div>
  );
}
