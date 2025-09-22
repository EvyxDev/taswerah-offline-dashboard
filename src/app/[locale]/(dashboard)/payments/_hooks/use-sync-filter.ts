import { useQuery } from "@tanstack/react-query";
import {
  GetBranchManagerSyncFilter,
  type BranchManagerSyncFilterResponse,
} from "@/lib/api/client";

export default function useSyncFilter(params: {
  employee_id?: string;
  employeeName?: string;
  from?: string;
  to?: string;
}) {
  const { data, isLoading, error, refetch } =
    useQuery<BranchManagerSyncFilterResponse>({
      queryKey: ["branch-manager-sync-filter", params],
      queryFn: () => GetBranchManagerSyncFilter(params),
      enabled: false,
      staleTime: 0,
    });

  return {
    syncFilterData: data,
    isLoading,
    error,
    refetch,
  };
}
