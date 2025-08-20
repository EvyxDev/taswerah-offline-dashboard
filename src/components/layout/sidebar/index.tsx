"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/tailwind-merge";
import LogOut from "./components/log-out";
import { useLocale, useTranslations } from "next-intl";
import { NAV_LINKS } from "@/lib/constants/nav.constant";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/routing";

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
  const rawPath = usePathname() || "/";
  const locale = useLocale();
  const pathname = stripLocale(rawPath, locale);
  const t = useTranslations("navigation");
  const user = useSession().data?.user;
  const name = user?.name;
  const email = user?.email;
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
              {name}
            </h6>
            <p className="font-homenaje text-md text-gray-400 -mt-0.5">
              {email}{" "}
            </p>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <div className="flex flex-col space-y-0">
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
