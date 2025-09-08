"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils/tailwind-merge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
// Replacing Popover with a custom dropdown panel

type DatePickerProps = {
  value?: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    try {
      return parseISO(value);
    } catch {
      return undefined;
    }
  }, [value]);

  React.useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node | null;
      if (!target) return;
      const wrap = wrapperRef.current;
      const panel = panelRef.current;
      if (panel && panel.contains(target)) return;
      if (wrap && wrap.contains(target)) return;
      setOpen(false);
    }
    function onDocKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        type="button"
        variant="outline"
        data-empty={!selectedDate}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal",
          className
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {selectedDate ? (
          format(selectedDate, "PPP")
        ) : (
          <span>{placeholder}</span>
        )}
      </Button>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute z-[60] mt-2 rounded-md border bg-popover p-2 shadow-md"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              onChange(d ? format(d, "yyyy-MM-dd") : undefined);
              setOpen(false);
            }}
            initialFocus
          />
        </div>
      ) : null}
    </div>
  );
}

export default DatePicker;
