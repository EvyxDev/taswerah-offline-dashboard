"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useTranslations } from "next-intl";

type PreviewFile = {
  file: File;
  previewUrl: string;
  id: string;
};

export default function MediaUploader({
  title,
  description,
  onUpload,
  isUploading,
  accept = "image/*",
  multiple = true,
  uploadLabel = "Upload",
}: {
  title: string;
  description?: string;
  onUpload: (files: File[]) => void;
  isUploading?: boolean;
  accept?: string;
  multiple?: boolean;
  uploadLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const t = useTranslations("mediaUploader");
  const openFilePicker = () => inputRef.current?.click();

  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files);
    const next = list.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${file.lastModified}`,
    }));
    setPreviews((prev) => {
      const ids = new Set(prev.map((p) => p.id));
      const merged = [...prev];
      for (const p of next) {
        if (!ids.has(p.id)) merged.push(p);
      }
      return merged;
    });
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const removePreview = (id: string) => {
    setPreviews((prev) => prev.filter((p) => p.id !== id));
  };

  const clearPreviews = () => setPreviews([]);

  const upload = () => {
    if (previews.length === 0 || isUploading) return;
    onUpload(previews.map((p) => p.file));
  };

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-homenaje rtl:font-almarai">{title}</h3>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-[#535862] text-white">
            {previews.length} {t("selected")}
          </Badge>
          <Button
            onClick={upload}
            disabled={isUploading || previews.length === 0}
            className="main-button"
          >
            {isUploading ? t("uploading") : uploadLabel}
          </Button>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="text-muted-foreground">{t("dragDropText")}</div>
          <div>
            <Button
              variant="secondary"
              onClick={openFilePicker}
              disabled={isUploading}
            >
              {t("browseFiles")}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={onInputChange}
              className="hidden"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {t("supportedFormats")}
          </div>
        </div>
      </div>

      {previews.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {previews.map((p) => (
            <div
              key={p.id}
              className="group relative rounded-xl overflow-hidden border bg-background"
            >
              <div className="relative aspect-square">
                <Image
                  src={p.previewUrl}
                  alt={p.file.name}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removePreview(p.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-2 py-1 rounded"
              >
                {t("remove")}
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {previews.length > 0 ? (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={clearPreviews}
            disabled={isUploading}
          >
            {t("clearSelection")}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
