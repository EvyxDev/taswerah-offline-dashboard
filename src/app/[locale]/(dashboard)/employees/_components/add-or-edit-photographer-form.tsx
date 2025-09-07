"use client";

// Libraries
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Removed branch select – only name is required
import { Alert, AlertDescription } from "@/components/ui/alert";

// Local Components
import useCreatePhotographer from "../_hooks/use-create-photographer";
import useEditPhotographer from "../_hooks/use-edit-photographer";
// import { useSession } from "next-auth/react";
// import { useBranches } from "../../_hooks/use-branshes";
import { toast } from "sonner";

const photographerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type PhotographerFields = z.infer<typeof photographerSchema>;

export default function AddOrEditPhotographerForm({
  onSuccess,
  edit = false,
  photoGrapher,
}: {
  onSuccess?: () => void;
  edit?: boolean;
  photoGrapher?: PhGrapher;
}) {
  // Hooks
  const t = useTranslations("photographers");
  // const { data } = useSession();
  const { AddPhotographer, AddPending, AddError } = useCreatePhotographer();
  const { EditPhotographer, EditPending, EditError } = useEditPhotographer();
  // const { data: branches, isLoading } = useBranches(data?.token || "");

  // Determine which mutation to use
  const isPending = edit ? EditPending : AddPending;
  const error = edit ? EditError : AddError;

  // Form
  const form = useForm<PhotographerFields>({
    resolver: zodResolver(photographerSchema),
    defaultValues: {
      name: photoGrapher ? photoGrapher.name : "",
      email: photoGrapher ? photoGrapher.email : "",
      password: "",
    },
  });

  async function onSubmit(values: PhotographerFields) {
    const sendData: CreatePhotographerBody = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    if (edit) {
      EditPhotographer(
        { data: sendData, id: photoGrapher?.id.toString() || "" },
        {
          onSuccess: (data) => {
            console.log("Photographer updated:", data);
            toast.success(t("photographer_updated_successfully"));
            form.reset();
            if (onSuccess) onSuccess();
          },
          onError: (err) => {
            console.log("Error updating photographer:", err);
            toast.error(t("error_updating_photographer"));
          },
        }
      );
    } else {
      AddPhotographer(sendData, {
        onSuccess: (data) => {
          console.log("Photographer created:", data);
          toast.success(t("photographer_created_successfully"));
          form.reset();
          if (onSuccess) onSuccess();
        },
        onError: (err) => {
          console.log("Error creating photographer:", err);
          toast.error(t("error_creating_photographer"));
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-7"
      >
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {edit
                ? t("errorEditingPhotographer")
                : t("errorAddingPhotographer")}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder={t("namePlaceholder")}
                      type="text"
                      required
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      placeholder={t("emailPlaceholder")}
                      type="email"
                      required
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      id="password"
                      placeholder={t("passwordPlaceholder")}
                      type="password"
                      required
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-center w-full mt-5 items-center">
          <Button
            className="main-button text-white font-homenaje rtl:font-almarai !rounded-none !px-8 !py-7 hover:!bg-[#202020]"
            type="submit"
            variant="default"
            disabled={isPending}
          >
            {isPending
              ? edit
                ? t("updating")
                : t("adding")
              : edit
              ? t("update")
              : t("save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
