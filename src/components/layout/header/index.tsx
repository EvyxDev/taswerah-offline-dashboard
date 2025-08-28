import { SidebarTrigger } from "@/components/ui/sidebar";
import { SwitchLocale } from "./components/switch-locale";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-20 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex-1 mx-4 max-w-md flex items-center gap-3">
          <SidebarTrigger className="-ml-1 " />

          <div className="relative w-full">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${
                isRTL ? "right-3" : "left-3"
              }`}
            />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className={`bg-[#F5F6FA] border-[#D5D5D5] rounded-full font-homenaje rtl:font-almarai ${
                isRTL ? "pr-10 text-right" : "pl-10 text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SwitchLocale />
        </div>
      </div>
    </header>
  );
}
