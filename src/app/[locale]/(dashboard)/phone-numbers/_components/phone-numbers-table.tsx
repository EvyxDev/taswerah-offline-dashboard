"use client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Phone, FileDown } from "lucide-react";
import { exportPhoneNumbersToExcel } from "@/lib/utils/excel-export";
import { toast } from "sonner";

type Props = {
  phoneNumbers: string[];
};

export default function PhoneNumbersTable({ phoneNumbers }: Props) {
  const t = useTranslations();

  const handleExport = () => {
    try {
      exportPhoneNumbersToExcel(phoneNumbers);
      toast.success("Phone numbers exported successfully!");
    } catch (error) {
      toast.error("Failed to export phone numbers");
      console.error("Export error:", error);
    }
  };

  return (
    <>
      <Card className="bg-background max-w-screen-2xl mx-auto rounded-2xl py-6">
        <div className="">
          {/* Header */}
          <div className="flex sm:flex-row gap-5 flex-col items-center justify-between mb-8 px-7">
            <div className="flex items-center gap-3 self-start">
              <h2 className="text-2xl font-homenaje rtl:font-almarai text-foreground">
                {t("navigation.phoneNumbers")}
              </h2>
              <Badge
                variant="secondary"
                className="bg-[#535862] font-homenaje rtl:font-almarai text-white hover:bg-[#535862]"
              >
                {phoneNumbers.length}
              </Badge>
            </div>

            <Button
              onClick={handleExport}
              variant="default"
              className="bg-[#535862] hover:bg-[#424751] text-white font-homenaje rtl:font-almarai text-sm px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              {t("phoneNumbers.exportExcel")}
            </Button>
          </div>

          {/* Table or Empty State */}
          {phoneNumbers?.length > 0 ? (
            <div className="border">
              <Table className="px-5">
                <TableHeader>
                  <TableRow className="px-7">
                    <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg   text-gray-400 text-muted-foreground text-start min-w-[100px]">
                      {t("phoneNumbers.index")}
                    </TableHead>
                    <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg   text-gray-400 text-muted-foreground text-start min-w-[200px]">
                      {t("phoneNumbers.phoneNumber")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {phoneNumbers.map((phoneNumber, index) => (
                    <TableRow
                      key={index}
                      className={`px-7 h-[70px] ${
                        index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white"
                      }`}
                    >
                      <TableCell>
                        <span className="font-medium font-homenaje rtl:font-almarai text-lg">
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="font-medium font-homenaje rtl:font-almarai text-lg">
                            {phoneNumber}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <Phone className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-homenaje rtl:font-almarai text-gray-600 mb-3">
                {t("phoneNumbers.noPhoneNumbersTitle")}
              </h3>
              <p className="text-gray-500 font-homenaje rtl:font-almarai text-center max-w-md mb-6">
                {t("phoneNumbers.noPhoneNumbersDescription")}
              </p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
