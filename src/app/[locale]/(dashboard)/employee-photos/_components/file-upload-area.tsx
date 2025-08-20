/* eslint-disable @next/next/no-img-element */
import { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FiX, FiUpload, FiFolder } from "react-icons/fi";

interface SelectedFile {
  file: File;
  preview: string;
}

// Minimal types for WebKit directory drag-and-drop support
interface WebkitFileSystemEntry {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  fullPath: string;
}

interface WebkitFileSystemFileEntry extends WebkitFileSystemEntry {
  file: (
    successCallback: (file: File) => void,
    errorCallback?: (error: DOMException) => void
  ) => void;
}

interface WebkitFileSystemDirectoryReader {
  readEntries: (
    successCallback: (entries: WebkitFileSystemEntry[]) => void,
    errorCallback?: (error: DOMException) => void
  ) => void;
}

interface WebkitFileSystemDirectoryEntry extends WebkitFileSystemEntry {
  createReader: () => WebkitFileSystemDirectoryReader;
}

const isDirectoryEntry = (
  entry: WebkitFileSystemEntry
): entry is WebkitFileSystemDirectoryEntry => entry.isDirectory === true;

const isFileEntry = (
  entry: WebkitFileSystemEntry
): entry is WebkitFileSystemFileEntry => entry.isFile === true;

interface ImageUploaderProps {
  selectedFiles: SelectedFile[];
  onFilesChange: (files: SelectedFile[]) => void;
  onError?: (error: string) => void;
  onFolderNameChange?: (folderName: string | null) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  acceptedFormats?: string[];
}

export default function ImageUploader({
  selectedFiles,
  onFilesChange,
  onError,
  onFolderNameChange,
  disabled = false,
  // maxSizePerFile retained for prop compatibility but not used
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

  const detectTopLevelFolderName = useCallback(
    (files: File[]): string | null => {
      for (const file of files) {
        const relativePath = (
          file as unknown as { webkitRelativePath?: string }
        ).webkitRelativePath;
        if (relativePath && typeof relativePath === "string") {
          const firstSegment = relativePath.split("/")[0];
          if (firstSegment) return firstSegment;
        }
      }
      return null;
    },
    []
  );

  const validateFiles = useCallback(
    (files: File[]): { validFiles: File[]; errors: string[] } => {
      return { validFiles: files, errors: [] };
    },
    []
  );

  // Recursively collect files from dropped folders (Chrome/WebKit)
  const collectFilesFromDataTransfer = useCallback(
    async (
      dataTransfer: DataTransfer
    ): Promise<{ files: File[]; folderName: string | null }> => {
      const items = Array.from(dataTransfer.items || []);
      if (items.length === 0) {
        return {
          files: Array.from(dataTransfer.files || []),
          folderName: null,
        };
      }

      const files: File[] = [];
      let topFolderName: string | null = null;

      const traverseEntry = async (
        entry: WebkitFileSystemEntry
      ): Promise<void> => {
        if (!entry) return;
        if (isFileEntry(entry)) {
          await new Promise<void>((resolve, reject) => {
            entry.file(
              (file: File) => {
                try {
                  const fullPath: string = (entry.fullPath || "").replace(
                    /^\//,
                    ""
                  );
                  if (!topFolderName) {
                    topFolderName = fullPath.split("/")[0] || null;
                  }
                  files.push(file);
                  resolve();
                } catch (err) {
                  reject(err as DOMException);
                }
              },
              (err: DOMException) => reject(err)
            );
          });
        } else if (isDirectoryEntry(entry)) {
          if (!topFolderName) {
            const dirPath = (entry.fullPath || "").replace(/^\//, "");
            topFolderName = dirPath.split("/")[0] || entry.name || null;
          }
          const reader = entry.createReader();
          await new Promise<void>((resolve) => {
            const readEntries = () => {
              reader.readEntries(async (entries: WebkitFileSystemEntry[]) => {
                if (!entries.length) {
                  resolve();
                  return;
                }
                await Promise.all(entries.map((child) => traverseEntry(child)));
                readEntries();
              });
            };
            readEntries();
          });
        }
      };

      await Promise.all(
        items.map(async (item) => {
          const entryGetter = (
            item as unknown as {
              webkitGetAsEntry?: () => WebkitFileSystemEntry | null;
            }
          ).webkitGetAsEntry;
          const entry =
            typeof entryGetter === "function" ? entryGetter.call(item) : null;
          if (entry) {
            if (!topFolderName) {
              const initialPath = (entry.fullPath || "").replace(/^\//, "");
              const entryWithName: WebkitFileSystemEntry =
                entry as WebkitFileSystemEntry;
              topFolderName =
                initialPath.split("/")[0] || entryWithName.name || null;
            }
            await traverseEntry(entry);
            return;
          }
          const file = item.getAsFile && item.getAsFile();
          if (file) files.push(file);
        })
      );

      return { files, folderName: topFolderName };
    },
    []
  );

  const processFiles = useCallback(
    (files: File[], folderNameOverride?: string | null) => {
      if (files.length === 0) {
        onError?.("Please select at least one image file");
        return;
      }

      // Enforce folder-based selection with exactly 4-character folder name
      const detectedFolder =
        folderNameOverride ?? detectTopLevelFolderName(files);
      if (!detectedFolder) {
        // silently ignore non-folder drops
        onFolderNameChange?.(null);
        return;
      }
      if (detectedFolder.length !== 4) {
        onError?.("Folder name must be exactly 4 characters");
        onFolderNameChange?.(detectedFolder);
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

      onFolderNameChange?.(detectedFolder);
      onFilesChange([...selectedFiles, ...newFiles]);
    },
    [
      selectedFiles,
      validateFiles,
      onError,
      onFilesChange,
      detectTopLevelFolderName,
      onFolderNameChange,
    ]
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
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const { files, folderName } = await collectFilesFromDataTransfer(
        event.dataTransfer
      );
      processFiles(files, folderName);
    },
    [processFiles, collectFilesFromDataTransfer]
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
    onFolderNameChange?.(null);
  }, [selectedFiles, onFilesChange, onFolderNameChange]);

  // const getTotalSize = useCallback(() => {
  // 	return selectedFiles.reduce((acc, file) => acc + file.file.size, 0);
  // }, [selectedFiles]);

  // const getFormatsList = useCallback(() => {
  // 	return acceptedFormats
  // 		.map((format) => format.split("/")[1].toUpperCase())
  // 		.join(", ");
  // }, [acceptedFormats]);

  return (
    <div className="space-y-4">
      {/* Upload Options */}
      <div className="grid grid-cols-1 gap-4">
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
              Choose a folder containing images (folder name must be exactly 4
              characters)
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
        <p className="text-sm text-gray-500">Or select a folder above</p>
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
