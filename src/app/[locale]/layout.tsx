import Providers from "@/components/providers";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { Noto_Kufi_Arabic } from "next/font/google";

const Homenaje = localFont({
  src: "./fonts/Homenaje-Regular.ttf",
  variable: "--font-Homenaje",
});

const NotoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});
export async function generateMetadata(): Promise<Metadata> {
  // Variables
  const title = "Taswera Ofline Dahsboard";

  return {
    title,
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LayoutProps) {
  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={` ${Homenaje.variable} ${
          locale === "ar" ? NotoKufiArabic.className : ""
        }`}
      >
        <Providers>
          {/* Main */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
