"use client";
import { useState } from "react";
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
import { FiFolder, FiUpload } from "react-icons/fi";
import ImportPhotosDialog from "./import-photos-dialog";

interface EmployeePhotosPageProps {
  employeeName: string;
  employeeId: string;
  codes: string[];
}

export default function EmployeePhotosPage({
  employeeName,
  codes,
  employeeId,
}: EmployeePhotosPageProps) {
  const t = useTranslations();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const hasPhotos = codes && codes.length > 0;

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
                alt={employeeName || t("dashboard.employeeName")}
              />
              <AvatarFallback className="text-sm font-medium">
                {employeeName
                  ? employeeName.charAt(0).toUpperCase()
                  : t("dashboard.employeeInitials")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium font-homenaje text-xl">
                {employeeName || t("dashboard.employeeName")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-col flex h-full">
          {hasPhotos ? (
            <div className="flex items-center gap-5 w-full flex-wrap">
              {codes.map((code) => {
                return (
                  <div key={code}>
                    <Folder id={code} />
                  </div>
                );
              })}
            </div>
          ) : (
            // Empty State
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center max-w-md mx-auto py-16">
                <div className="mb-6">
                  <div className="relative mx-auto w-24 h-24 mb-4">
                    <div className="absolute inset-0 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiFolder size={32} className="text-gray-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                      <FiUpload size={16} className="text-gray-500" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-homenaje text-gray-700 mb-2">
                  No Photos Found
                </h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  This employee doesn&apos;t have any photo codes yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className="main-button w-fit mt-auto self-center"
        onClick={() => setIsImportDialogOpen(true)}
      >
        Import photos by codes
      </button>

      <ImportPhotosDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        employeeId={employeeId}
      />
    </div>
  );
}
