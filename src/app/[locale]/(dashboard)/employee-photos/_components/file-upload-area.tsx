/* eslint-disable @next/next/no-img-element */
import { useCallback, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FiX,
  FiFolder,
  FiImage,
  FiCheck,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import { useUploadSinglePhoto } from "../_hooks/use-upload-single-photo";

export interface SelectedFile {
  file: File;
  name: string;
  size: string;
  preview?: string;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  uploadError?: string;
}

interface ImageUploaderProps {
  selectedFiles: SelectedFile[];
  onFilesChange: (files: SelectedFile[]) => void;
  onError?: (error: string) => void;
  onFolderNameChange?: (folderName: string | null) => void;
  disabled?: boolean;
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

  const uploadMutation = useUploadSinglePhoto({
    onError: (error) => onError?.(error),
  });

  const detectTopLevelFolderName = useCallback((files: File[]) => {
    for (const file of files) {
      const relativePath = (file as File).webkitRelativePath as
        | string
        | undefined;
      if (relativePath) {
        const first = relativePath.split("/")[0];
        if (first) return first;
      }
    }
    return null;
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const validateFiles = useCallback(
    (files: File[]) => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        if (!acceptedFormats.includes(file.type)) {
          errors.push(`Invalid format: ${file.name}`);
          continue;
        }
        validFiles.push(file);
      }

      return { validFiles, errors };
    },
    [acceptedFormats]
  );

  const processFiles = useCallback(
    async (files: File[], forcedFolder?: string | null) => {
      if (!files.length) {
        onError?.("Please select at least one image file");
        return;
      }

      const folder = forcedFolder ?? detectTopLevelFolderName(files);
      if (!folder) {
        onError?.("Could not detect folder name. Please select a folder.");
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
      if (errors.length > 0) onError?.(errors.join("; "));
      if (!validFiles.length) return;

      const total = validFiles.length;
      setProcessingProgress({ total, processed: 0 });
      if (autoUpload && employeeIds.length) {
        setUploadProgress({ total, uploaded: 0, failed: 0 });
      }

      const newFiles: SelectedFile[] = validFiles.map((file) => ({
        file,
        name: file.name,
        size: formatFileSize(file.size),
        uploadStatus: autoUpload && employeeIds.length ? "idle" : "success",
        uploadError: undefined,
      }));

      filesRef.current = [...filesRef.current, ...newFiles];
      onFilesChange(filesRef.current);

      setProcessingProgress((p) => (p ? { ...p, processed: total } : null));

      // Auto-upload with concurrency control
      if (autoUpload && employeeIds.length && barcodePrefix) {
        const maxConcurrent = 10;
        let activeCount = 0;
        let index = 0;

        const uploadNext = async () => {
          if (index >= total) return;
          if (activeCount >= maxConcurrent) return;

          while (activeCount < maxConcurrent && index < total) {
            const currentIndex = index;
            const selectedFile = newFiles[index];
            index++;
            activeCount++;

            const employeeId = employeeIds[currentIndex % employeeIds.length];

            // Update status to uploading
            const currentList = [...filesRef.current];
            const idx = currentList.findIndex(
              (f) =>
                f.name === selectedFile.name && f.size === selectedFile.size
            );
            if (idx !== -1) {
              currentList[idx].uploadStatus = "uploading";
              onFilesChange(currentList);
            }

            try {
              uploadMutation.mutate(
                {
                  photo: selectedFile.file,
                  barcodePrefix,
                  employeeId,
                },
                {
                  onSuccess: () => {
                    const list = [...filesRef.current];
                    const i = list.findIndex(
                      (f) =>
                        f.name === selectedFile.name &&
                        f.size === selectedFile.size
                    );
                    if (i !== -1) {
                      list[i].uploadStatus = "success";
                      onFilesChange(list);
                    }
                    setUploadProgress((p) =>
                      p ? { ...p, uploaded: p.uploaded + 1 } : p
                    );
                    activeCount--;
                    uploadNext();
                  },
                  onError: (err: Error) => {
                    const list = [...filesRef.current];
                    const i = list.findIndex(
                      (f) =>
                        f.name === selectedFile.name &&
                        f.size === selectedFile.size
                    );
                    if (i !== -1) {
                      list[i].uploadStatus = "error";
                      list[i].uploadError = err.message;
                      onFilesChange(list);
                    }
                    setUploadProgress((p) =>
                      p ? { ...p, failed: p.failed + 1 } : p
                    );
                    activeCount--;
                    uploadNext();
                  },
                }
              );
            } catch (err) {
              const list = [...filesRef.current];
              const i = list.findIndex(
                (f) =>
                  f.name === selectedFile.name && f.size === selectedFile.size
              );
              if (i !== -1) {
                list[i].uploadStatus = "error";
                list[i].uploadError =
                  ((err as Error)?.message as string) || "Compression failed";
                onFilesChange(list);
              }
              setUploadProgress((p) =>
                p ? { ...p, failed: p.failed + 1 } : p
              );
              activeCount--;
              uploadNext();
            }
          }
        };

        uploadNext();
      }
    },
    [
      employeeIds,
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
      temp.splice(index, 1);
      filesRef.current = temp;
      onFilesChange(temp);
    },
    [onFilesChange]
  );

  const clearAllFiles = useCallback(() => {
    uploadMutation.clearQueue();
    filesRef.current = [];
    onFilesChange([]);
    onFolderNameChange?.(null);
    setProcessingProgress(null);
    setUploadProgress(null);
  }, [onFilesChange, onFolderNameChange, uploadMutation]);

  const fileList = useMemo(() => {
    return selectedFiles.map((file, index) => {
      const statusIcon =
        file.uploadStatus === "uploading" ? (
          <FiLoader className="animate-spin text-yellow-600" />
        ) : file.uploadStatus === "success" ? (
          <FiCheck className="text-green-600" />
        ) : file.uploadStatus === "error" ? (
          <FiAlertCircle className="text-red-600" />
        ) : (
          <FiImage className="text-gray-500" />
        );

      return (
        <div
          key={`${file.name}-${file.size}-${index}`}
          className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-lg">{statusIcon}</div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{file.size}</p>
            </div>
          </div>

          {file.uploadError && (
            <p className="text-xs text-red-600 max-w-xs truncate mr-8">
              {file.uploadError}
            </p>
          )}

          <button
            onClick={() => removeFile(index)}
            disabled={disabled}
            className="text-red-500 hover:text-red-700 transition"
          >
            <FiX size={18} />
          </button>
        </div>
      );
    });
  }, [selectedFiles, disabled, removeFile]);

  return (
    <div className="space-y-6">
      {/* Folder Picker */}
      <div className="relative">
        <input
          type="file"
          multiple
          accept={acceptedFormats.join(",")}
          onChange={handleFileSelect}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          {...{ webkitdirectory: "", directory: "" }}
        />

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
          <FiFolder size={32} className="mx-auto mb-3 text-gray-400" />
          <p className="text-base font-medium text-gray-700">
            Click to Select Entire Folder
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last 5 characters of folder name will be used as barcode prefix
          </p>
        </div>
      </div>

      {/* Progress Bars */}
      {processingProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Processing files</span>
            <span>
              {processingProgress.processed} / {processingProgress.total}
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
          <div className="flex justify-between text-sm">
            <span>Uploading</span>
            <span>
              {uploadProgress.uploaded} successful, {uploadProgress.failed}{" "}
              failed
            </span>
          </div>
          <Progress
            value={
              ((uploadProgress.uploaded + uploadProgress.failed) /
                uploadProgress.total) *
              100
            }
            className="h-2"
          />
        </div>
      )}

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <p className="text-sm font-medium text-gray-700">
            Selected Files ({selectedFiles.length})
          </p>
          {fileList}
        </div>
      )}

      {/* Clear Button */}
      <Button
        variant="destructive"
        onClick={clearAllFiles}
        disabled={disabled || selectedFiles.length === 0}
        className="w-full"
      >
        Clear All Files
      </Button>
    </div>
  );
}
