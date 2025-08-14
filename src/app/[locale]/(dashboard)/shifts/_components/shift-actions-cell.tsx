"use client";

import DeleteDialog from "@/components/common/delete-dialog";
import { HiMiniTrash } from "react-icons/hi2";
import { FaPen } from "react-icons/fa6";

export default function ShiftActionsCell({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-center gap-7">
      <DeleteDialog
        action={onDelete}
        description="Are you sure you want to delete this shift? This action cannot be undone."
        title="Delete Shift"
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
