"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DatePicker from "@/components/ui/date-picker";

export function DateRangeFilter({
  fromDate,
  toDate,
}: {
  fromDate?: string;
  toDate?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value) params.set(key, value);
    else params.delete(key);
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="flex items-center gap-2">
      <DatePicker
        value={fromDate}
        onChange={(v) => updateParam("from_date", v)}
      />
      <DatePicker value={toDate} onChange={(v) => updateParam("to_date", v)} />
    </div>
  );
}

export default DateRangeFilter;
