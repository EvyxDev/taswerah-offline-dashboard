"use client";

import { useTranslations } from "next-intl";

import useUploadFrames from "../_hooks/use-upload-frames";
import useUploadStickers from "../_hooks/use-upload-stickers";
import useDeleteFrames from "../_hooks/use-delete-frames";
import useDeleteStickers from "../_hooks/use-delete-stickers";
import { toast } from "sonner";
import MediaUploader from "./media-uploader";
import MediaGallery from "./media-gallery";

export default function SettingsPage({
  frames,
  stickers,
}: {
  frames: Photo[];
  stickers: Photo[];
}) {
  const t = useTranslations("settings");
  const { UploadFrames, UploadFramesPending } = useUploadFrames();
  const { UploadStickers, UploadStickersPending } = useUploadStickers();
  const { DeleteFrames, DeleteFramesPending } = useDeleteFrames();
  const { DeleteStickers, DeleteStickersPending } = useDeleteStickers();

  const uploadFrames = (files: File[]) => {
    if (files.length === 0) return;
    UploadFrames(
      { files },
      {
        onSuccess: () => {
          toast.success("Frames uploaded successfully");
        },
        onError: () => toast.error("Failed to upload frames"),
      }
    );
  };

  const uploadStickers = (files: File[]) => {
    if (files.length === 0) return;
    UploadStickers(
      { files },
      {
        onSuccess: () => {
          toast.success("Stickers uploaded successfully");
        },
        onError: () => toast.error("Failed to upload stickers"),
      }
    );
  };

  const deleteFrames = (ids: Array<number | string>) => {
    if (ids.length === 0) return;
    DeleteFrames(
      { ids },
      {
        onSuccess: () => toast.success("Frames deleted successfully"),
        onError: () => toast.error("Failed to delete frames"),
      }
    );
  };

  const deleteStickers = (ids: Array<number | string>) => {
    if (ids.length === 0) return;
    DeleteStickers(
      { ids },
      {
        onSuccess: () => toast.success("Stickers deleted successfully"),
        onError: () => toast.error("Failed to delete stickers"),
      }
    );
  };

  return (
    <div className="space-y-10 px-6 xl:px-10 py-5">
      <MediaUploader
        title={t("frames")}
        description={t("framesUploaderDescription")}
        onUpload={uploadFrames}
        isUploading={UploadFramesPending}
        uploadLabel={t("upload")}
      />
      <MediaGallery
        title={t("framesGallery") || t("frames")}
        items={frames}
        emptyText={t("noItems")}
        onDelete={deleteFrames}
        deleteLabel={t("delete") || "Delete selected"}
        isDeleting={DeleteFramesPending}
      />

      <MediaUploader
        title={t("stickers")}
        description={t("stickersUploaderDescription")}
        onUpload={uploadStickers}
        isUploading={UploadStickersPending}
        uploadLabel={t("upload")}
      />
      <MediaGallery
        title={t("stickersGallery") || t("stickers")}
        items={stickers}
        emptyText={t("noItems")}
        onDelete={deleteStickers}
        deleteLabel={t("delete") || "Delete selected"}
        isDeleting={DeleteStickersPending}
      />
    </div>
  );
}
