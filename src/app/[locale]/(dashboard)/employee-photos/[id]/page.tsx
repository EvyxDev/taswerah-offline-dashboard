import Folder from "@/components/common/folder";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";
import { IoMdHome } from "react-icons/io";

export default function EmployeePhotosPage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col min-h-screen px-6 xl:px-10 py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="flex items-center gap-2 font-homenaje text-sm text-gray-400"
            >
              <BreadcrumbPage className="flex items-center gap-2 font-homenaje text-sm text-gray-400">
                <IoMdHome size={28} color="black" className="-mt-2" />
                {t("navigation.dashboard")}
              </BreadcrumbPage>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{t("dashboard.viewPhotos")}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main content grows to fill space */}
      <div className="flex-grow pb-10 pt-5 space-y-8">
        <div className="flex items-center justify-between w-full mb-5">
          <h2 className="text-3xl font-homenaje text-main-black">
            {t("dashboard.viewPhotos")}
          </h2>
          <div className="flex items-center gap-3 border-main-black border-1 border p-3 rounded-xl">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={"/placeholder.svg"}
                alt={t("dashboard.employeeName")}
              />
              <AvatarFallback className="text-sm font-medium">
                {t("dashboard.employeeInitials")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium font-homenaje text-xl">
                {t("dashboard.employeeName")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-col flex h-full">
          <div className="flex items-center gap-5 w-full flex-wrap">
            <Folder />
            <Folder />
            <Folder />
            <Folder />
            <Folder />
            <Folder />
            <Folder />
          </div>
        </div>
      </div>

      <button className="main-button w-fit mt-auto self-center">
        Import photos by codes
      </button>
    </div>
  );
}
