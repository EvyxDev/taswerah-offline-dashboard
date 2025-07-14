"use client";

import { IoLogOut } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function LogOut() {
  // Navigation
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const t = useTranslations("logout");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const route = useRouter();

  const handleLogout = async () => {
    const res = await signOut({
      redirect: false,
      callbackUrl: "/auth/login",
    });

    if (res?.url) {
      router.push(res.url);
    }
  };

  return (
    <>
      <div className={`mb-10 ${isRTL ? "pr-6" : "pl-6"}`}>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-3 text-white text-xl sm:text-2xl font-homenaje hover:text-gray-300 transition-colors"
        >
          <IoLogOut
            className={`text-gray-400 text-xl sm:text-2xl ${
              isRTL ? "rotate-0" : "rotate-180"
            }`}
          />
          {t("logOut")}
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="text-center px-4 py-6 sm:px-10 sm:py-12 rounded-3xl w-[90vw] max-w-md sm:max-w-3xl mx-auto">
          <DialogHeader className="flex items-center">
            <DialogTitle className="text-2xl sm:text-4xl font-medium font-homenaje">
              {t("logOut")}
            </DialogTitle>
            <DialogDescription className="text-lg sm:text-4xl font-homenaje text-gray-500 mt-2 sm:mt-3">
              {t("confirmMessage")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center my-4 sm:my-8">
            <Image
              src="/assets/logout.png"
              alt="Logout"
              width={80}
              height={60}
              className="sm:w-[120px] sm:h-[80px]"
            />
          </div>

          <div
            className={`flex flex-col sm:flex-row justify-center gap-4 sm:gap-20 ${
              isRTL ? "sm:flex-row-reverse" : ""
            }`}
          >
            <button
              className="main-button w-full sm:w-1/2 font-homenaje text-lg sm:text-xl"
              onClick={() => {
                route.push("/auth/login");
              }}
            >
              {t("logOut")}
            </button>
            <button
              className="main-button-border w-full sm:w-1/2 font-homenaje text-lg sm:!text-2xl"
              onClick={handleLogout}
            >
              {t("cancel")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
