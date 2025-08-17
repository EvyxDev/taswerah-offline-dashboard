"use client";

import DeleteDialog from "@/components/common/delete-dialog";
import { HiMiniTrash } from "react-icons/hi2";
import { FaPen } from "react-icons/fa6";
import { useTranslations } from "next-intl";

export default function ShiftActionsCell({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations();
  return (
    <div className="flex justify-center gap-7">
      <DeleteDialog
        action={onDelete}
        description={t("shifts.delete_description")}
        title={t("shifts.delete_title")}
      >
        <button className="">
          <HiMiniTrash className="text-black text-2xl" />
        </button>
      </DeleteDialog>
      <button className=" text-black" onClick={onEdit}>
        <FaPen />
      </button>
    </div>
  );
}
