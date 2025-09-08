"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FilterDialog({
  shifts,
  selectedShiftId,
  fromDate: initialFromProp,
  toDate: initialToProp,
  staff,
  selectedStaffId,
}: {
  shifts: TShift[];
  selectedShiftId?: string;
  fromDate?: string;
  toDate?: string;
  staff: Employee[];
  selectedStaffId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialFrom = useMemo(
    () =>
      typeof searchParams?.get("from_date") === "string"
        ? searchParams?.get("from_date") || undefined
        : undefined,
    [searchParams]
  );
  const initialTo = useMemo(
    () =>
      typeof searchParams?.get("to_date") === "string"
        ? searchParams?.get("to_date") || undefined
        : undefined,
    [searchParams]
  );

  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState<string | undefined>(initialFrom);
  const [toDate, setToDate] = useState<string | undefined>(initialTo);
  const [shiftValue, setShiftValue] = useState<string>(
    selectedShiftId ?? "all"
  );
  const [staffValue, setStaffValue] = useState<string>(
    selectedStaffId ?? "all"
  );
  const [warning, setWarning] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setFromDate(initialFromProp ?? initialFrom);
      setToDate(initialToProp ?? initialTo);
      setShiftValue(selectedShiftId ?? "all");
      setStaffValue(selectedStaffId ?? "all");
    }
  }, [
    open,
    initialFrom,
    initialTo,
    initialFromProp,
    initialToProp,
    selectedShiftId,
    selectedStaffId,
  ]);

  const apply = () => {
    setWarning(undefined);
    const params = new URLSearchParams(searchParams?.toString() || "");
    // Only one filter active: priority order dates > staff > shift
    if (fromDate || toDate) {
      params.delete("shift_id");
      params.delete("staff_id");
      if (fromDate) params.set("from_date", fromDate);
      else params.delete("from_date");
      if (toDate) params.set("to_date", toDate);
      else params.delete("to_date");
    } else if (staffValue && staffValue !== "all") {
      // apply staff, clear others
      params.delete("from_date");
      params.delete("to_date");
      params.delete("shift_id");
      params.set("staff_id", staffValue);
    } else {
      // apply shift only
      params.delete("from_date");
      params.delete("to_date");
      params.delete("staff_id");
      if (shiftValue && shiftValue !== "all")
        params.set("shift_id", shiftValue);
      else params.delete("shift_id");
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    setOpen(false);
  };

  const clear = () => {
    // Local reset only; keep dialog open and do not navigate
    setFromDate(undefined);
    setToDate(undefined);
    setShiftValue("all");
    setStaffValue("all");
    setWarning(undefined);
  };

  const canApply = Boolean(
    fromDate ||
      toDate ||
      (shiftValue && shiftValue !== "all") ||
      (staffValue && staffValue !== "all")
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Filter</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm">From date</span>
            <DatePicker
              value={fromDate}
              disabled={shiftValue !== "all" || staffValue !== "all"}
              onChange={(v) => {
                if (shiftValue !== "all" || staffValue !== "all") {
                  setWarning(
                    "You can only filter by one: clear other filters to select dates."
                  );
                  return;
                }
                setWarning(undefined);
                setFromDate(v);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm">To date</span>
            <DatePicker
              value={toDate}
              disabled={shiftValue !== "all" || staffValue !== "all"}
              onChange={(v) => {
                if (shiftValue !== "all" || staffValue !== "all") {
                  setWarning(
                    "You can only filter by one: clear other filters to select dates."
                  );
                  return;
                }
                setWarning(undefined);
                setToDate(v);
              }}
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <span className="text-sm">Staff</span>
            <Select
              value={staffValue}
              onValueChange={(val) => {
                if (
                  (fromDate ||
                    toDate ||
                    (shiftValue && shiftValue !== "all")) &&
                  val !== "all"
                ) {
                  setWarning(
                    "You can only filter by one: clear other filters to select staff."
                  );
                  setStaffValue("all");
                  return;
                }
                setWarning(undefined);
                setStaffValue(val);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">
                  All staff
                </SelectItem>
                {staff.map((emp) => (
                  <SelectItem key={emp.id} value={String(emp.id)}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <span className="text-sm">Shift</span>
            <Select
              value={shiftValue}
              onValueChange={(val) => {
                if (
                  (fromDate ||
                    toDate ||
                    (staffValue && staffValue !== "all")) &&
                  val !== "all"
                ) {
                  setWarning(
                    "You can only filter by one: clear other filters to select a shift."
                  );
                  setShiftValue("all");
                  return;
                }
                setWarning(undefined);
                setShiftValue(val);
              }}
            >
              <SelectTrigger className="w-full">
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
          </div>
          {warning ? (
            <span className="text-xs text-red-500 md:col-span-2">
              {warning}
            </span>
          ) : null}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={clear}>
            Clear
          </Button>
          <Button onClick={apply} disabled={!canApply}>
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FilterDialog;
