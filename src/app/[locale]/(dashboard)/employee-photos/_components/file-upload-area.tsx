/* eslint-disable @next/next/no-img-element */
import { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FiX, FiUpload, FiFolder } from "react-icons/fi";

interface SelectedFile {
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  selectedFiles: SelectedFile[];
  onFilesChange: (files: SelectedFile[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  acceptedFormats?: string[];
}

export default function ImageUploader({
  selectedFiles,
  onFilesChange,
  onError,
  disabled = false,
  maxFiles = 100,
  maxSizePerFile = 10,
  acceptedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
  ],
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFiles = useCallback(
    (files: File[]): { validFiles: File[]; errors: string[] } => {
      const errors: string[] = [];
      const validFiles: File[] = [];

      for (const file of files) {
        if (
          !acceptedFormats.some(
            (format) =>
              file.type === format ||
              file.type.startsWith(format.split("/")[0] + "/")
          )
        ) {
          errors.push(`${file.name}: Unsupported file format`);
          continue;
        }

        // Check file size
        if (file.size > maxSizePerFile * 1024 * 1024) {
          errors.push(`${file.name}: File too large (max ${maxSizePerFile}MB)`);
          continue;
        }

        validFiles.push(file);
      }

      // Check total files limit
      if (selectedFiles.length + validFiles.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        const allowedCount = maxFiles - selectedFiles.length;
        return { validFiles: validFiles.slice(0, allowedCount), errors };
      }

      return { validFiles, errors };
    },
    [selectedFiles.length, maxFiles, maxSizePerFile, acceptedFormats]
  );

  const processFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) {
        onError?.("Please select at least one image file");
        return;
      }

      const { validFiles, errors } = validateFiles(files);

      if (errors.length > 0) {
        onError?.(errors.join(", "));
      }

      if (validFiles.length === 0) {
        return;
      }

      const newFiles: SelectedFile[] = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      onFilesChange([...selectedFiles, ...newFiles]);
    },
    [selectedFiles, validateFiles, onError, onFilesChange]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      processFiles(files);
      event.target.value = "";
    },
    [processFiles]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = Array.from(event.dataTransfer.files);
      processFiles(files);
    },
    [processFiles]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    []
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = [...selectedFiles];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      onFilesChange(newFiles);
    },
    [selectedFiles, onFilesChange]
  );

  const clearAllFiles = useCallback(() => {
    selectedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
    onFilesChange([]);
  }, [selectedFiles, onFilesChange]);

  // const getTotalSize = useCallback(() => {
  //   return selectedFiles.reduce((acc, file) => acc + file.file.size, 0);
  // }, [selectedFiles]);

  // const getFormatsList = useCallback(() => {
  //   return acceptedFormats
  //     .map((format) => format.split("/")[1].toUpperCase())
  //     .join(", ");
  // }, [acceptedFormats]);

  return (
    <div className="space-y-4">
      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Folder Selection */}
        <div className="relative">
          <input
            type="file"
            multiple
            accept={acceptedFormats.join(",")}
            onChange={handleFileSelect}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            {...({
              webkitdirectory: "",
              directory: "",
            } as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100">
            <FiFolder size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Select Entire Folder
            </p>
            <p className="text-xs text-gray-500">
              Choose a folder containing images
            </p>
          </div>
        </div>

        {/* Multiple Files Selection */}
        <div className="relative">
          <input
            type="file"
            multiple
            accept={acceptedFormats.join(",")}
            onChange={handleFileSelect}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100">
            <FiUpload size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Select Multiple Files
            </p>
            <p className="text-xs text-gray-500">
              Choose individual image files
            </p>
          </div>
        </div>
      </div>

      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-blue-500 bg-blue-100"
            : "border-blue-300 bg-blue-50 hover:bg-blue-100"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <FiUpload
          size={32}
          className={`mx-auto mb-3 ${
            isDragOver ? "text-blue-600" : "text-blue-400"
          }`}
        />
        <p className="text-base font-medium text-gray-700 mb-2">
          {isDragOver ? "Drop images here" : "Drag and drop images here"}
        </p>
        <p className="text-sm text-gray-500">
          Or use the options above to select files or folders
        </p>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-medium">
              Selected Photos ({selectedFiles.length})
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAllFiles}
              disabled={disabled}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-80 overflow-y-auto">
              {selectedFiles.map((selectedFile, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <img
                      src={selectedFile.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-0 -right-0 bg-red-500 text-white rounded-full p-.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                    disabled={disabled}
                    title="Remove image"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
