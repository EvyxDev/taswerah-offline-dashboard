"use client";
import Folder from "@/components/common/folder";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Image from "next/image";

export default function FolderPage({
  photos,
  folderId,
}: {
  photos: Photo[];
  folderId: string;
}) {
  const router = useRouter();
  const t = useTranslations();
  console.log(photos);
  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/zip/${folderId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to generate zip");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${folderId}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    } catch (error) {
      console.error("Failed to download zip", error);
    }
  };
  return (
    <div className="px-6 xl:px-10 py-5 space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 font-homenaje rtl:font-almarai text-sm text-gray-400">
              {t("navigation.printedSent")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col-reverse sm:flex-row items-center w-full justify-between mb-8 gap-4 sm:gap-6">
        <div className="self-start">
          <Folder id={folderId} />
        </div>
        <div className="flex items-center gap-3 self-end">
          <button
            className="main-button !text-xl !px-5 !py-3"
            onClick={handleDownload}
          >
            {t("printedSent.download")}
          </button>
          <button
            className="main-button !text-xl !px-5 !py-3"
            onClick={() => router.back()}
          >
            {t("printedSent.back")}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos?.map((photo) => (
          <div
            key={photo.id}
            className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
          >
            <Image
              src={photo.file_path}
              alt={`${t("printedSent.image")} ${photo.id + 1}`}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
