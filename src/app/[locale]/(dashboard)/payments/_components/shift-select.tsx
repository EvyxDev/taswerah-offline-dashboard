"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ShiftSelect({
  shifts,
  selectedShiftId,
}: {
  shifts: TShift[];
  selectedShiftId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value === "all") {
      params.delete("shift_id");
    } else {
      params.set("shift_id", value);
    }
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const currentValue = selectedShiftId ?? "all";

  return (
    <Select onValueChange={handleChange} value={currentValue}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select shift" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="all" value="all">
          All shifts
        </SelectItem>
        {shifts.map((shift) => (
          <SelectItem key={shift.id} value={String(shift.id)}>
            {shift.name} ({shift.from} - {shift.to})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
