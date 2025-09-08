/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import ImageUploader from "./file-upload-area";
import { useUploadPhotos } from "../_hooks/use-upload-photos";

const importPhotosSchema = z.object({
  barcodePrefix: z
    .string()
    .length(4, "Code must be exactly 4 characters (auto from folder name)"),
  photos: z.array(z.instanceof(File)).min(1, "At least one photo is required"),
  selectedEmployees: z
    .array(z.number())
    .min(1, "At least one employee must be selected"),
});

type ImportPhotosFormData = z.infer<typeof importPhotosSchema>;

interface SelectedFile {
  file: File;
  preview: string;
}

interface ImportPhotosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employees: PhGrapher[];
}

export default function ImportPhotosDialog({
  isOpen,
  onClose,
  employees,
}: ImportPhotosDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [selectedEmployeeOptions, setSelectedEmployeeOptions] = useState<
    Option[]
  >([]);
  const t = useTranslations();

  // Convert employees to options format
  const employeeOptions: Option[] = employees.map((employee) => ({
    label: employee.name,
    value: employee.id.toString(),
  }));

  const form = useForm<ImportPhotosFormData>({
    resolver: zodResolver(importPhotosSchema),
    defaultValues: {
      barcodePrefix: "",
      photos: [],
    },
  });

  // Use the mutation hook
  const uploadPhotosMutation = useUploadPhotos({
    onSuccess: () => {
      handleDialogClose();
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
  });

  const handleFilesChange = (files: SelectedFile[]) => {
    setSelectedFiles(files);
    const fileArray = files.map((sf) => sf.file);
    form.setValue("photos", fileArray);

    if (fileArray.length === 0) {
      form.setError("photos", {
        type: "manual",
        message: "At least one photo is required",
      });
    } else {
      form.clearErrors("photos");
    }
  };

  const handleEmployeeSelectionChange = (selectedOptions: Option[]) => {
    setSelectedEmployeeOptions(selectedOptions);
    const employeeIds = selectedOptions.map((option) => parseInt(option.value));
    form.setValue("selectedEmployees", employeeIds, { shouldValidate: true });

    if (employeeIds.length === 0) {
      form.setError("selectedEmployees", {
        type: "manual",
        message: "At least one employee must be selected",
      });
    } else {
      form.clearErrors("selectedEmployees");
    }
  };

  const handleFolderNameChange = (folderName: string | null) => {
    const code = (folderName ?? "").trim();
    form.setValue("barcodePrefix", code, { shouldValidate: true });
    if (!code) {
      form.setError("barcodePrefix", {
        type: "manual",
        message: "Select a folder so code can be auto-filled",
      });
    } else if (code.length !== 4) {
      form.setError("barcodePrefix", {
        type: "manual",
        message: "Code must be exactly 4 characters (from folder name)",
      });
    } else {
      form.clearErrors("barcodePrefix");
    }
  };

  const handleFileError = (error: string) => {
    form.setError("photos", {
      type: "manual",
      message: error,
    });
  };

  const onSubmit = async (data: ImportPhotosFormData) => {
    uploadPhotosMutation.mutate({
      photos: data.photos,
      barcodePrefix: data.barcodePrefix,
      employeeIds: data.selectedEmployees, // Pass the array of selected employee IDs
    });
    // Close immediately after submit as requested
    handleDialogClose(true);
  };

  const handleDialogClose = (force = false) => {
    if (force || !uploadPhotosMutation.isPending) {
      selectedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
      setSelectedFiles([]);
      setSelectedEmployeeOptions([]);
      form.reset();
      onClose();
    }
  };

  const isUploading = uploadPhotosMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={() => handleDialogClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-homenaje rtl:font-almarai text-xl">
            {t("employeePhotos.dialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("employeePhotos.dialog.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Employee Selection Field */}
            <FormField
              control={form.control}
              name="selectedEmployees"
              render={() => (
                <FormItem>
                  <FormLabel className="font-medium">
                    {t("employeePhotos.dialog.selectEmployees")}
                  </FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={selectedEmployeeOptions}
                      onChange={handleEmployeeSelectionChange}
                      defaultOptions={employeeOptions}
                      placeholder={t(
                        "employeePhotos.dialog.selectEmployeesPlaceholder"
                      )}
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          {t("employeePhotos.dialog.noEmployeesFound")}
                        </p>
                      }
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Barcode Prefix Field */}
            <FormField
              control={form.control}
              name="barcodePrefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    {t("employeePhotos.dialog.barcodePrefix")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "employeePhotos.dialog.barcodePrefixPlaceholder"
                      )}
                      {...field}
                      readOnly
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload Field using ImageUploader component */}
            <FormField
              control={form.control}
              name="photos"
              render={() => (
                <FormItem>
                  <FormLabel className="font-medium">
                    {t("employeePhotos.dialog.selectPhotos")}
                  </FormLabel>
                  <FormControl>
                    <ImageUploader
                      selectedFiles={selectedFiles}
                      onFilesChange={handleFilesChange}
                      onError={handleFileError}
                      onFolderNameChange={handleFolderNameChange}
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Root Error Display */}
            {form.formState.errors.root && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {form.formState.errors.root.message}
              </div>
            )}

            {/* Display mutation error if any */}
            {uploadPhotosMutation.isError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {uploadPhotosMutation.error?.message || "Upload failed"}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose()}
                disabled={isUploading}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="bg-main-black text-white hover:bg-gray-800"
              >
                {isUploading
                  ? t("employeePhotos.dialog.uploading")
                  : t("employeePhotos.dialog.upload")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
