"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";
import ReadyToPrintDialog from "./ready-to-print-dialog";
import Folder from "@/components/common/folder";
import { useState } from "react";

interface ReadyToPrintPage {
  barcodes: string[];
}

export default function ReadyToPrintPage({ barcodes }: ReadyToPrintPage) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCodePrefix, setSelectedCodePrefix] = useState<string>("");

  const handleFolderClick = (barcode: string) => {
    setSelectedCodePrefix(barcode);
    setDialogOpen(true);
  };

  const t = useTranslations();
  return (
    <>
      <div className=" space-y-8 px-6 xl:px-10 py-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>{t("readyToPrint.breadcrumb")}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="pb-10 pt-5 space-y-8 ">
          <div className="flex items-center justify-between w-full mb-5 ">
            <h2 className="text-3xl font-homenaje  text-main-black ">
              {t("readyToPrint.title")}
            </h2>
          </div>
          <div className="flex items-center gap-5 w-full flex-wrap">
            {barcodes.map((barcode) => (
              <div
                key={barcode}
                className="w-full max-w-[300px] cursor-pointer"
                onClick={() => handleFolderClick(barcode)}
              >
                <Folder id={barcode} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <ReadyToPrintDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        barcode={selectedCodePrefix}
      />
    </>
  );
}
