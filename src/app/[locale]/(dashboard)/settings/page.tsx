"use client";
import React from "react";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations();
  return (
    <div className=" space-y-8 px-6 xl:px-10 py-5">
      <div className="pb-10 pt-5 space-y-8 ">
        <div className="flex items-center justify-between w-full mb-5 ">
          <h2 className="text-3xl font-homenaje rtl:font-almarai  text-main-black ">
            {t("navigation.settings")}
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center w-full py-16 text-center gap-3">
          <svg
            className="w-16 h-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-2xl font-semibold text-gray-800">
            {t("settings.comingSoonTitle")}
          </h3>
          <p className="text-secondary">
            {t("settings.comingSoonDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
