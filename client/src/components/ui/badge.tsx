import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { EventPriorityEnum, EventStatusEnum } from "@/constant";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        [EventStatusEnum.BACKLOG]: "bg-gray-100 text-gray-600",
        [EventStatusEnum.TODO]: "  bg-[#DEEBFF] text-[#0052CC]",
        [EventStatusEnum.IN_PROGRESS]: "bg-yellow-100 text-yellow-600",
        [EventStatusEnum.IN_REVIEW]: "bg-purple-100 text-purple-500",
        [EventStatusEnum.DONE]: "bg-green-100 text-green-600",
        [EventPriorityEnum.HIGH]: "bg-orange-100 text-orange-600",
        [EventPriorityEnum.URGENT]: "bg-red-100 text-red-600",
        [EventPriorityEnum.MEDIUM]: "bg-yellow-100 text-yellow-600",
        [EventPriorityEnum.LOW]: "bg-gray-100 text-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
