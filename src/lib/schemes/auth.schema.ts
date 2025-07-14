import { useTranslations } from "next-intl";
import { z } from "zod";

export const useRegisterSchema = () => {
  // Translation
  const t = useTranslations();

  return z
    .object({
      username: z
        .string({ required_error: t("username-required") })
        .min(1, t("username-required")),
      firstName: z
        .string({ required_error: t("firstname-required") })
        .min(1, t("firstname-required")),
      lastName: z
        .string({ required_error: t("lastname-required") })
        .min(1, t("lastname-required")),
      email: z.string({ required_error: t("email-required") }).email({
        message: t("email-invalid"),
      }),
      phone: z
        .string({ required_error: t("phone-required") })
        .min(1, t("phone-required")),
      password: z.string({ required_error: t("password-required") }).min(8, {
        message: t("password-min", { min: 8 }),
      }),
      rePassword: z.string(),
    })
    .refine((data) => data.password === data.rePassword, {
      message: t("password-mismatch"),
      path: ["rePassword"],
    });
};

export type RegistrationFields = z.infer<ReturnType<typeof useRegisterSchema>>;

export const useLoginSchema = () => {
  return z.object({
    phone: z.string({ required_error: "Phone number is required" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    // .regex(
    //   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    //   "Password must include at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
    // ),
  });
};

export type LoginFields = z.infer<ReturnType<typeof useLoginSchema>>;
