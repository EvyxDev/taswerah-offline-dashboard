/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useTranslations } from "next-intl";

export default function PaymentTable({ clients }: { clients: Client[] }) {
  const t = useTranslations();

  return (
    <Card className=" bg-background max-w-screen-2xl mx-auto rounded-2xl py-6 ">
      <div className="">
        {/* Header */}
        <div className="flex sm:flex-row gap-5 flex-col items-center justify-between mb-8 px-7">
          <div className="flex items-center gap-3 self-start">
            <h2 className="text-2xl font-homenaje rtl:font-almarai  text-foreground">
              {t("payments.clients")}
            </h2>
            <Badge
              variant="secondary"
              className="bg-[#535862] font-homenaje rtl:font-almarai t text-white hover:bg-[#535862]"
            >
              {clients?.length || 0}
            </Badge>
          </div>
        </div>

        {/* Table */}
        <div className="border">
          <Table className="px-5">
            <TableHeader>
              <TableRow className="px-7">
                <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg   text-gray-400 text-muted-foreground text-start min-w-[100px]">
                  {t("payments.clientCode")}
                </TableHead>

                <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg text-gray-400 text-muted-foreground text-center min-w-[150px] ">
                  {t("payments.phoneNumber")}
                </TableHead>
                <TableHead className="font-medium font-homenaje rtl:font-almarai text-lg text-gray-400 text-muted-foreground text-center min-w-[150px] ">
                  {t("payments.amount")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients?.length > 0 ? (
                clients?.map((client, index) => (
                  <TableRow
                    key={client.barcode}
                    className={`px-7 h-[70px] ont-homenaje ${
                      index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white"
                    }`}
                  >
                    <TableCell>{client.barcode}</TableCell>

                    <TableCell className="text-center font-homenaje rtl:font-almarai text-lg ">
                      {client.phone_number}
                    </TableCell>
                    <TableCell className="text-center font-homenaje rtl:font-almarai text-lg ">
                      {client.total_paid}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8"
                  ></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
