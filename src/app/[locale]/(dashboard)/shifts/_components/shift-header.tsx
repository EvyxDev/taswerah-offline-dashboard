"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ShiftHeader({
  count,
  onCreate,
}: {
  count: number;
  onCreate: () => void;
}) {
  return (
    <div className="flex sm:flex-row gap-5 flex-col items-center justify-between mb-8 px-7">
      <div className="flex items-center gap-3 self-start">
        <h2 className="text-2xl font-homenaje text-foreground">Shifts</h2>
        <Badge
          variant="secondary"
          className="bg-[#535862] font-homenaje text-white hover:bg-[#535862]"
        >
          {count}
        </Badge>
      </div>
      <Button className="main-button" onClick={onCreate}>
        Add
      </Button>
    </div>
  );
}
