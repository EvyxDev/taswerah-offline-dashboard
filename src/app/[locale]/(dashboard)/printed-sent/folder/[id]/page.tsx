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
const images: string[] = [
  "/assets/image-1.png",
  "/assets/image-2.png",
  "/assets/image-3.png",
  "/assets/image.png",
];

const repeatedImages = Array.from({ length: 8 }, (_, i) => images[i % 4]);

export default function FolderPage() {
  const router = useRouter();
  const t = useTranslations();
  return (
    <div className="px-6 xl:px-10 py-5 space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 font-homenaje text-sm text-gray-400">
              {t("navigation.printedSent")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col-reverse sm:flex-row items-center w-full justify-between mb-8 gap-4 sm:gap-6">
        <div className="self-start">
          <Folder />
        </div>
        <button className="main-button self-end" onClick={() => router.back()}>
          {t("printedSent.back")}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {repeatedImages.map((src, idx) => (
          <div
            key={idx}
            className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
          >
            <Image
              src={src}
              alt={`${t("printedSent.image")} ${idx + 1}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
