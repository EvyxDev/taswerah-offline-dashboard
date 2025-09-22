"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Phone, Hash } from "lucide-react";
import { CreateOrder } from "../_action/create-order";
import ImageUploader from "../../employee-photos/_components/file-upload-area";
import { toast } from "sonner";

interface SelectedFile {
  file: File;
  preview: string;
}

type CreateOrderDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
};

const formSchema = z.object({
  barcode_prefix: z
    .string()
    .length(5, "Code must be exactly 5 characters (auto from folder name)"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-\s]+$/, "Please enter a valid phone number"),
  employee_id: z.string().min(1, "Employee is required"),
  photos: z.array(z.any()).min(1, "Please upload at least one photo"),
});

type FormData = z.infer<typeof formSchema>;

export function CreateOrderDialog({
  isOpen,
  onClose,
  employees,
}: CreateOrderDialogProps) {
  const t = useTranslations();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      barcode_prefix: "",
      phone_number: "",
      employee_id: "",
      photos: [],
    },
  });

  const handleFilesChange = (files: SelectedFile[]) => {
    setSelectedFiles(files);
    form.setValue(
      "photos",
      files.map((f) => f.file)
    );
    form.clearErrors("photos");
  };

  const handleFolderNameChange = (folderName: string | null) => {
    const code = (folderName ?? "").trim();
    form.setValue("barcode_prefix", code, { shouldValidate: true });
    if (!code) {
      form.setError("barcode_prefix", {
        type: "manual",
        message: "Select a folder so code can be auto-filled",
      });
    } else if (code.length !== 5) {
      form.setError("barcode_prefix", {
        type: "manual",
        message: "Code must be exactly 5 characters (from folder name)",
      });
    } else {
      form.clearErrors("barcode_prefix");
    }
  };

  const handleFileError = (error: string) => {
    form.setError("photos", { message: error });
    toast.error(error);
  };

  const onSubmit = async (data: FormData) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("barcode_prefix", data.barcode_prefix || "");
      formData.append("phone_number", data.phone_number || "");
      formData.append("employee_id", data.employee_id?.toString() || "");

      (data.photos || []).forEach((photo: File) => {
        formData.append("photos[]", photo);
      });

      const result = await CreateOrder(formData);

      console.log("Order created successfully:", result);
      toast.success("Order created");
      form.reset();
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error("Order creation failed:", error);
      const message =
        error instanceof Error ? error.message : "Order creation failed";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[100vh] overflow-y-auto font-homenaje rtl:font-almarai">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-homenaje rtl:font-almarai text-foreground">
              {t("order.create.title")}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="py-4 space-y-4">
              {/* Barcode Prefix */}
              <FormField
                control={form.control}
                name="barcode_prefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 font-homenaje rtl:font-almarai">
                      {t("order.barcode_prefix")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder={t("order.barcode_prefix_placeholder")}
                          className="pl-10 font-homenaje rtl:font-almarai h-12"
                          {...field}
                          readOnly
                          disabled
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 font-homenaje rtl:font-almarai">
                      {t("order.phone_number")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder={t("order.phone_number_placeholder")}
                          className="pl-10 font-homenaje rtl:font-almarai h-12"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employee Select */}
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 font-homenaje rtl:font-almarai">
                      {t("order.employee")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="font-homenaje rtl:font-almarai h-12">
                          <SelectValue
                            placeholder={t("order.select_employee_placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem
                            key={employee.id}
                            value={employee.id.toString()}
                            className="font-homenaje rtl:font-almarai"
                          >
                            <span className="font-medium">{employee.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photos */}
              <FormField
                control={form.control}
                name="photos"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      {t("order.select_photos")}
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
            </div>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="font-homenaje rtl:font-almarai main-button-border !rounded-none !px-8 !py-7"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="main-button text-white font-homenaje rtl:font-almarai !rounded-none !px-8 !py-7"
                disabled={isUploading}
              >
                {t("order.create.submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
