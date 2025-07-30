"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/tailwind-merge";
import LogOut from "./components/log-out";
import { useLocale, useTranslations } from "next-intl";
import { NAV_LINKS } from "@/lib/constants/nav.constant";

function stripLocale(path: string, locale: string) {
  const segments = path.split("/");
  if (segments[1] === locale) {
    return "/" + segments.slice(2).join("/");
  }
  return path;
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const rawPath = usePathname();
  const locale = useLocale();
  const pathname = stripLocale(rawPath, locale);
  const t = useTranslations("navigation");

  return (
    <>
      <Sidebar
        side={locale === "ar" ? "right" : "left"}
        className="px-12"
        collapsible="offcanvas"
        {...props}
      >
        <SidebarHeader className="mt-12 sm:px-0 pl-5">
          <Image
            src={"/assets/white-logo-v2.png"}
            alt="Logo"
            width={180}
            height={0}
          />
          <div className="flex flex-col mt-14">
            <Image
              src={"/assets/avatar.png"}
              alt="Avatar"
              width={60}
              height={0}
              className="rounded-2xl"
            />
            <h6 className="font-homenaje text-2xl text-gray-100 mt-2">
              Samantha
            </h6>
            <p className="font-homenaje text-md text-gray-400 -mt-0.5">
              samantha@email.com
            </p>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <div className="flex flex-col mt-14 space-y-0">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "font-homenaje text-2xl text-white px-7 py-3  rounded-2xl transition-colors backdrop-blur-3xl",
                  isActive(pathname, href) ? "bg-white/10" : "bg-transparent"
                )}
              >
                {t(label)}
              </Link>
            ))}
          </div>
        </SidebarContent>

        <SidebarFooter>
          <LogOut />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
