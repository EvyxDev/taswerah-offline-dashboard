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
import { useState } from "react";
import { Package } from "lucide-react";
import { PayDialog } from "./pay-dialog";

type Props = {
  invoices: TInvoice[];
};

export default function OrderTable({ invoices }: Props) {
  const t = useTranslations();
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);

  const handlePayClick = (barcode: string) => {
    setSelectedBarcode(barcode);
    setIsPayDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsPayDialogOpen(false);
    setSelectedBarcode(null);
  };

  return (
    <>
      <Card className="bg-background max-w-screen-2xl mx-auto rounded-2xl py-6">
        <div className="">
          {/* Header */}
          <div className="flex sm:flex-row gap-5 flex-col items-center justify-between mb-8 px-7">
            <div className="flex items-center gap-3 self-start">
              <h2 className="text-2xl font-homenaje text-foreground">
                {t("navigation.orders")}
              </h2>
              <Badge
                variant="secondary"
                className="bg-[#535862] font-homenaje text-white hover:bg-[#535862]"
              >
                {invoices.length}
              </Badge>
            </div>
          </div>

          {/* Table or Empty State */}
          {invoices?.length > 0 ? (
            <div className="border">
              <Table className="px-5">
                <TableHeader>
                  <TableRow className="px-7">
                    <TableHead className="font-medium font-homenaje text-lg text-gray-400 text-muted-foreground text-start min-w-[200px]">
                      {t("order.code")}
                    </TableHead>
                    <TableHead className="font-medium font-homenaje text-lg text-gray-400 text-muted-foreground text-center min-w-[150px] sm:w-[100px]">
                      {t("order.noPhotos")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {invoices.map((invoice, index) => (
                    <TableRow
                      key={invoice.id}
                      className={`px-7 h-[70px] ${
                        index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white"
                      }`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="font-medium font-homenaje text-lg">
                            {invoice.barcode_prefix}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center font-homenaje text-lg font-medium text-muted-foreground">
                        {invoice.num_photos}
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          onClick={() => handlePayClick(invoice.barcode_prefix)}
                          className="bg-[#535862] hover:bg-[#424751] text-white font-homenaje text-sm px-4 py-2 rounded-md"
                        >
                          {t("order.pay")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-homenaje text-gray-600 mb-3">
                {t("order.noOrdersTitle")}
              </h3>
              <p className="text-gray-500 font-homenaje text-center max-w-md mb-6">
                {t("order.noOrdersDescription")}
              </p>
            </div>
          )}
        </div>
      </Card>

      <PayDialog
        isOpen={isPayDialogOpen}
        onClose={handleCloseDialog}
        barcode={selectedBarcode}
      />
    </>
  );
}
