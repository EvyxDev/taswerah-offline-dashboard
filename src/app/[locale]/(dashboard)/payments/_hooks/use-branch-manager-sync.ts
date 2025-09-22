import { useQuery } from "@tanstack/react-query";
import {
  GetBranchManagerSyncLast,
  type BranchManagerSyncResponse,
} from "@/lib/api/client";

export default function useBranchManagerSync() {
  const { data, isLoading, error, refetch } =
    useQuery<BranchManagerSyncResponse>({
      queryKey: ["branch-manager-sync-last"],
      queryFn: GetBranchManagerSyncLast,
      refetchInterval: 10 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      retry: 1,
      retryDelay: 2000,
      refetchOnWindowFocus: false,
    });

  console.log("useBranchManagerSync - data:", data);
  console.log("useBranchManagerSync - isLoading:", isLoading);
  console.log("useBranchManagerSync - error:", error);

  return {
    syncData: data,
    isLoading,
    error,
    refetch,
  };
}
