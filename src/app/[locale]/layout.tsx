import Providers from "@/components/providers";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Homenaje, Almarai } from "next/font/google";

const homenaje = Homenaje({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-homenaje",
  display: "swap",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-almarai",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const title = t("application-title");

  return { title };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LayoutProps) {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${homenaje.variable} ${almarai.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
