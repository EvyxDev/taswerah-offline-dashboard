"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useTranslations } from "next-intl";
import { GetExportStats, type ExportStatsResponse } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import ExportDocument from "./export-document";

export default function ExportDialog() {
  const t = useTranslations("payments");
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const { data, isFetching, refetch, error } = useQuery<ExportStatsResponse>({
    queryKey: ["export-stats", { fromDate, toDate }],
    queryFn: () =>
      GetExportStats({
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
      }),
    enabled: false,
  });

  const periodLabel = useMemo(() => {
    if (fromDate && toDate) return `${fromDate} → ${toDate}`;
    if (fromDate) return `${fromDate} → present`;
    return undefined;
  }, [fromDate, toDate]);

  const onSubmit = async () => {
    setSubmitted(true);
    await refetch();
  };

  const resetState = () => {
    setFromDate("");
    setToDate("");
    setSubmitted(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetState();
      }}
    >
      <DialogTrigger asChild>
        <Button className="main-button !py-[23px] !px-5 !rounded-none font-homenaje rtl:font-almarai text-sm">
          {t("export", { default: "Export PDF" })}
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-4xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center text-3xl font-homenaje rtl:font-almarai font-normal mb-2">
            {t("export_title", { default: "Export Statistics" })}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-50">
          <div className="flex flex-col gap-2">
            <label className="font-homenaje rtl:font-almarai text-lg">
              {t("from_date", { default: "From date" })}
            </label>
            <DatePicker
              value={fromDate || undefined}
              onChange={(v) => setFromDate(v || "")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-homenaje rtl:font-almarai text-lg">
              {t("to_date", { default: "To date" })}
            </label>
            <DatePicker
              value={toDate || undefined}
              onChange={(v) => setToDate(v || "")}
            />
          </div>
          <div className="flex items-end">
            <Button
              className="main-button !py-[23px] !px-5 !rounded-none w-full"
              type="button"
              onClick={onSubmit}
              disabled={isFetching || (!fromDate && !toDate)}
            >
              {isFetching
                ? t("loading", { default: "Loading..." })
                : t("export_generate", { default: "Generate" })}
            </Button>
          </div>
        </div>

        {submitted && error && (
          <div className="text-red-500 text-center">
            {t("export_error", { default: "Failed to load export data" })}
          </div>
        )}

        {data && (
          <div className="mt-6 space-y-4">
            <div className="h-[70vh] border">
              <PDFViewer width="100%" height="100%" showToolbar>
                <ExportDocument data={data} periodLabel={periodLabel} />
              </PDFViewer>
            </div>
            <div className="flex justify-center">
              <PDFDownloadLink
                document={
                  <ExportDocument data={data} periodLabel={periodLabel} />
                }
                fileName={`export_${fromDate || "start"}_${
                  toDate || "present"
                }.pdf`}
              >
                {({ loading }: { loading: boolean }) => (
                  <Button className="main-button !py-7" disabled={loading}>
                    {loading
                      ? t("downloading", { default: "Preparing..." })
                      : t("download", { default: "Download PDF" })}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
