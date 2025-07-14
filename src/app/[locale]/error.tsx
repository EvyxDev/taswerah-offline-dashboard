"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");
  const router = useRouter();

  useEffect(() => {
    // Log the error for debugging
    console.error("Error in /auth:", error);
  }, [error]);

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <svg
            className="w-20 h-20 text-red-500"
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
        </div>

        {/* Error Title */}
        <h2 className="text-3xl font-bold text-gray-800">
          {t("title")}
        </h2>

        {/* Error Message */}
        <p className="text-secondary text-xl">
          {error.message || t("defaultMessage")}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center md:flex-row flex-col gap-4">
          <button
            onClick={reset}
            className="2xl:px-6 px-5 py-3 bg-primary text-white text-xl font-semibold rounded-lg  hover:bg-primary-dark transition-all duration-300 cursor-pointer"
            >
            {t("tryAgain")}
          </button>
          <button
            onClick={() => router.push("/")}
            className="2xl:px-6 px-5 py-3 border-primary border-[2px] text-primary text-xl font-semibold rounded-lg  hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
            >
            {t("goHome")}
          </button>
        </div>

        {/* Error Digest (for debugging, hidden in production) */}
        {process.env.NODE_ENV === "development" && error.digest && (
          <p className="text-sm text-gray-400 mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}