import { GetInvoiceByClient } from "@/lib/api/Invoice.api";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Receipt({ clientId }: { clientId: string }) {
  const { data: session } = useSession();

  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoice", clientId],
    queryFn: () => GetInvoiceByClient(clientId, session?.token || ""),
    enabled: !!session?.token,
  });
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " • " +
      date.toLocaleTimeString("en-US")
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#ffffff] min-h-screen p-8 font-mono">
        <div className="max-w-md mx-auto bg-[#ffffff] text-[#000000] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-[#6d7278]">Loading receipt...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#ffffff] min-h-screen p-8 font-mono">
        <div className="max-w-md mx-auto bg-[#ffffff] text-[#000000] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading receipt</p>
            <p className="text-[#6d7278] text-sm">
              {error instanceof Error
                ? error.message
                : "Unknown error occurred"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!invoices) {
    return (
      <div className="bg-[#ffffff] min-h-screen p-8 font-mono">
        <div className="max-w-md mx-auto bg-[#ffffff] text-[#000000] flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#6d7278]">No receipt data found</p>
          </div>
        </div>
      </div>
    );
  }

  const invoice = invoices[0];
  console.log(invoice);
  return (
    <div className="bg-[#ffffff] p-8 font-mono">
      <div className="max-w-md mx-auto bg-[#ffffff] text-[#000000]">
        {/* Header */}
        <div className="text-center mb-6 flex-col flex justify-center items-center gap-4">
          <Image
            src={"/assets/logo.png"}
            alt="Logo"
            width={150}
            height={0}
            className=""
          />
          <p className="text-sm text-[#6d7278]">
            {formatDate(invoice.created_at)}
          </p>
        </div>

        {/* Receipt Details */}
        <div className="space-y-4">
          {/* Customer Details */}
          <div className="flex justify-between items-center">
            <span className="text-[#6d7278]">Customer Code</span>
            <span className="font-medium">{invoice.barcode_prefix}</span>
          </div>

          <div className="border-t border-dotted border-[#d8d8d8] my-4"></div>

          {/* Payment Details */}
          <div className="flex justify-between items-center">
            <span className="text-[#6d7278]">Amount</span>
            <span className="font-medium">{invoice.amount} NGN</span>
          </div>

          <div className="border-t border-dotted border-[#d8d8d8] my-4"></div>
        </div>

        {/* Thank You Message */}
        <div className="mt-8 mb-8 text-sm text-[#6d7278] leading-relaxed">
          <p>
            Thanks for fueling our passion. Drop by again, if your wallet
            isn&apos;t still sulking. You&apos;re always welcome here!
          </p>
        </div>

        {/* Footer Logo */}
        <div className="flex items-center justify-center mt-12">
          <Image
            src={"/assets/logo.png"}
            alt="Logo"
            width={200}
            height={0}
            className=""
          />
        </div>
      </div>
    </div>
  );
}
