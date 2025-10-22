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
import { CreateOrderDialog } from "./create-dialog";
import { FaPlus } from "react-icons/fa6";
import EmptyState from "@/components/common/empty-state";

type Props = {
  orders: TOrders[];
  employees: Employee[];
  shifts: TShift[];
};

export default function OrderTable({ orders, employees, shifts }: Props) {
  const t = useTranslations();
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handlePayClick = (order: TOrders) => {
    setSelectedBarcode(order.barcode_prefix);
    setSelectedOrderId(order.id);
    setIsPayDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsPayDialogOpen(false);
    setSelectedBarcode(null);
    setSelectedOrderId(null);
  };

  return (
    <>
      <Card className="bg-background max-w-screen-2xl mx-auto rounded-2xl py-6">
        <div className="">
          {/* Header */}
          <div className="flex sm:flex-row gap-5 flex-col items-center justify-between mb-8 px-7">
            <div className="flex items-center gap-3 self-start">
              <h2 className="text-2xl font-homenaje rtl:font-almarai text-foreground">
                {t("navigation.orders")}
              </h2>
              <Badge
                variant="secondary"
                className="bg-[#535862] font-homenaje rtl:font-almarai text-white hover:bg-[#535862]"
              >
                {orders.length}
              </Badge>
            </div>

            <Button
              variant="default"
              className="font-homenaje rtl:font-almarai text-lg main-button !w-[50px] !px-2 !py-0 !rounded-none"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <FaPlus className="!text-6xl" />
            </Button>
          </div>

          {/* Table or Empty State */}
          {orders?.length > 0 ? (
            <div className="border">
              <Table className="px-5">
                <TableHeader>
                  <TableRow className="px-7">
                    <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg   text-gray-400 text-muted-foreground text-start min-w-[200px]">
                      {t("order.code")}
                    </TableHead>
                    <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg   text-gray-400 text-muted-foreground text-center min-w-[150px] sm:w-[100px]">
                      {t("order.noPhotos")}
                    </TableHead>
                    <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg   text-gray-400 text-muted-foreground text-center min-w-[150px] sm:w-[100px]">
                      {t("order.phone_number")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {orders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      className={`px-7 h-[70px] ${
                        index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white"
                      }`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="font-medium font-homenaje rtl:font-almarai text-lg">
                            {order.barcode_prefix}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center font-homenaje rtl:font-almarai text-lg font-medium text-muted-foreground">
                        {order.photos_count}
                      </TableCell>
                      <TableCell className="text-center font-homenaje rtl:font-almarai text-lg font-medium text-muted-foreground">
                        {order.phone_number}
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          onClick={() => handlePayClick(order)}
                          className="bg-[#535862] hover:bg-[#424751] text-white font-homenaje rtl:font-almarai text-sm px-4 py-2 rounded-md"
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
            <EmptyState
              icon={<Package className="w-12 h-12 text-gray-400" />}
              title={t("order.noOrdersTitle")}
              description={t("order.noOrdersDescription")}
              actionButton={{
                label: t("order.createOrder", { default: "Create Order" }),
                onClick: () => setIsCreateDialogOpen(true),
              }}
            />
          )}
        </div>
      </Card>
      <CreateOrderDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        employees={employees}
      />
      <PayDialog
        isOpen={isPayDialogOpen}
        onClose={handleCloseDialog}
        barcode={selectedBarcode}
        orderId={selectedOrderId}
        shifts={shifts}
      />
    </>
  );
}
