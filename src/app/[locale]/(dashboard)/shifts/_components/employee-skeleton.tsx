import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function EmployeeTableSkeleton() {
  return (
    <Card className="bg-background m-8 rounded-2xl py-6 h-full">
      <div className="w-full h-fit">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8 px-7">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-8" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Table Skeleton */}
        <div className="border">
          <Table>
            <TableHeader>
              <TableRow className="px-7">
                <TableHead>
                  <Skeleton className="h-6 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-32" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-[100px]" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(7)].map((_, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-[#E9EAEB]" : "bg-white"}>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-7">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-6 w-6" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between mt-6 px-7">
          <Skeleton className="h-10 w-32" />
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-8 w-8" />
            ))}
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </Card>
  );
}

export function PhotographerTableSkeleton() {
  return <EmployeeTableSkeleton />;
}
