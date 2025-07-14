import { GetInvoice } from "@/lib/api/Invoice.api";
import { useQuery } from "@tanstack/react-query";

export default function useGetInvoice(id: string, token: string) {
  const { isPending, error, data } = useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const payload = await GetInvoice(id, token);
      return payload;
    },
    enabled: !!id && !!token,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return { isPending, error, invoice: data };
}
