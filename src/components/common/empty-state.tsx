"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tailwind-merge";

interface EmptyStateProps {
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

export default function EmptyState({
  icon,
  title,
  description,
  actionButton,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-8",
        className
      )}
    >
      {icon && <div className="bg-gray-100 rounded-full p-6 mb-6">{icon}</div>}

      <h3 className="text-xl font-homenaje rtl:font-almarai text-gray-600 mb-3">
        {title}
      </h3>

      {description && (
        <p className="text-gray-500 font-homenaje rtl:font-almarai text-center max-w-md mb-6">
          {description}
        </p>
      )}

      {actionButton && (
        <Button
          onClick={actionButton.onClick}
          variant={actionButton.variant || "default"}
          className="font-homenaje rtl:font-almarai"
        >
          {actionButton.label}
        </Button>
      )}
    </div>
  );
}
