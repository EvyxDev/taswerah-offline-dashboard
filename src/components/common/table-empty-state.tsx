"use client";

import { ReactNode } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import EmptyState from "./empty-state";

interface TableEmptyStateProps {
  colSpan: number;
  icon?: ReactNode;
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    variant?:
      | "default"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | "destructive";
  };
  className?: string;
}

export default function TableEmptyState({
  colSpan,
  icon,
  title,
  description,
  actionButton,
  className,
}: TableEmptyStateProps) {
  return (
    <TableRow className={className}>
      <TableCell colSpan={colSpan} className="text-center py-8">
        <EmptyState
          icon={icon}
          title={title}
          description={description}
          actionButton={actionButton}
        />
      </TableCell>
    </TableRow>
  );
}
