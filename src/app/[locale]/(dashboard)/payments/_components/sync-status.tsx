"use client";

import useBranchManagerSync from "../_hooks/use-branch-manager-sync";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import { format } from "date-fns";

export default function SyncStatus() {
  const { syncData, isLoading, error } = useBranchManagerSync();

  console.log("SyncStatus - syncData:", syncData);
  console.log("SyncStatus - isLoading:", isLoading);
  console.log("SyncStatus - error:", error);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
        <Clock className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-600">Sync status unavailable</span>
      </div>
    );
  }

  if (!syncData) {
    return null;
  }

  const formatLastSyncDate = (lastSyncTime: string) => {
    try {
      const date = new Date(lastSyncTime);
      return format(date, "MMM dd, yyyy 'at' HH:mm");
    } catch {
      return lastSyncTime;
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      <Clock className="h-4 w-4 text-gray-500" />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">Last Sync</span>
        <span className="text-xs text-gray-500">
          {formatLastSyncDate(syncData.last_sync_time)}
        </span>
      </div>
    </div>
  );
}
