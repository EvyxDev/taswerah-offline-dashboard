import * as React from "react";
import { ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils/tailwind-merge";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <Link
    href={props.href || ""}
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "active" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<"button">) => (
  <Button
    type="button"
    aria-label="Go to previous page"
    size="default"
    className={cn(
      "gap-2 font-homenaje rtl:font-almarai text-xl shadow-sm border disabled:bg-[#FAFAFA] bg-background hover:bg-slate-200",
      className
    )}
    {...props}
  >
    <ArrowLeft className="h-8 w-8" />
    <span>Previous</span>
  </Button>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<"button">) => (
  <Button
    type="button"
    aria-label="Go to next page"
    size="default"
    className={cn(
      "gap-2 font-homenaje rtl:font-almarai text-xl shadow-sm border bg-background hover:bg-slate-200 disabled:bg-[#FAFAFA]",
      className
    )}
    {...props}
  >
    <span>Next</span>
    <ArrowRight className="h-8 w-8" />
  </Button>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
