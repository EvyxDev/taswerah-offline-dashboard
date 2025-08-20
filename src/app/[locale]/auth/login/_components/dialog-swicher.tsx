"use client";

import { Button } from "@/components/ui/button";
import { Locale, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/tailwind-merge";

export function DialogSwicher({ className }: { className?: string }) {
  // Translation
  const locale = useLocale();

  // Navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Variables
  const languages = [
    { code: "ar", name: "للغة العربية" },
    { code: "en", name: "For English" },
  ];

  // Functions
  const switchLocale = () => {
    // Toggle between languages
    const nextLocale = locale === "en" ? "ar" : "en";
    const queryString = searchParams ? `?${searchParams.toString()}` : "";
    router.push(`${pathname}${queryString}`, {
      locale: nextLocale as Locale,
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLocale}
      className={cn(
        "gap-1 px-2 bg-transparent hover:bg-transparent font-bold text-lg transition-all duration-200 text-white",
        className
      )}
    >
      {/* Current language name */}
      <span className="hidden sm:inline-block">
        {languages.find((lang) => lang.code !== locale)?.name}
      </span>
    </Button>
  );
}
