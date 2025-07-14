import Providers from "@/components/providers";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import localFont from "next/font/local";

const Homenaje = localFont({
  src: "./fonts/Homenaje-Regular.ttf",
  variable: "--font-Homenaje",
});
export async function generateMetadata(): Promise<Metadata> {
  // Translation
  const t = await getTranslations();

  // Variables
  const title = t("application-title");

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
      <body className={` ${Homenaje.variable}`}>
        <Providers>
          {/* Main */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
