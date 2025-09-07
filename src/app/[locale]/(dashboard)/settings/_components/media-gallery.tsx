"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export default function MediaGallery({
  title,
  items,
  emptyText,
  onDelete,
  deleteLabel = "Delete selected",
  isDeleting = false,
}: {
  title: string;
  items: Photo[];
  emptyText?: string;
  onDelete?: (ids: Array<number | string>) => void;
  deleteLabel?: string;
  isDeleting?: boolean;
}) {
  const [selected, setSelected] = useState<Set<number | string>>(new Set());
  const t = useTranslations("mediaGallery");

  const toggle = (id: number | string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = useMemo(
    () => selected.size === items.length && items.length > 0,
    [selected, items.length]
  );
  const hasSelection = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  };

  const handleDelete = () => {
    if (!onDelete || !hasSelection || isDeleting) return;
    onDelete(Array.from(selected));
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-homenaje rtl:font-almarai">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {items.length} {t("items")}
          </div>
          {onDelete ? (
            <>
              <Button
                variant="ghost"
                onClick={toggleAll}
                disabled={items.length === 0}
              >
                {allSelected ? t("unselectAll") : t("selectAll")}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!hasSelection || isDeleting}
              >
                {isDeleting ? t("deleting") : deleteLabel}
              </Button>
            </>
          ) : null}
        </div>
      </div>
      {items.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          {emptyText || t("noItems")}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={`group relative rounded-xl overflow-hidden border bg-background outline-none ${
                selected.has(item.id) ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="relative aspect-square">
                <Image
                  src={item.photo}
                  alt={item.name || t("media")}
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className={`absolute inset-0 bg-primary/10 transition-opacity ${
                  selected.has(item.id)
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              />
              {selected.has(item.id) ? (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  {t("selected")}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
