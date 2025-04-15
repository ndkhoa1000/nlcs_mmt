import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";

import { DataTableColumnHeader } from "./table-column-header";
import { DataTableRowActions } from "./table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  EventPriorityEnum,
  EventPriorityEnumType,
  EventStatusEnumType,
} from "@/constant";
import {
  formatStatusToEnum,
  getAvatarColor,
  getAvatarFallbackText,
  StatusBadgeVariant,
} from "@/lib/helper";
import { priorities, statuses } from "./data";
import { EventType } from "@/types/api.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";

export const getColumns = (programId?: string): ColumnDef<EventType>[] => {
  const columns: ColumnDef<EventType>[] = [
    {
      id: "_id",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="block lg:max-w-[220px] max-w-[200px] font-medium">
              {row.original.title}
            </span>
          </div>
        );
      },
    },
    ...(programId
      ? [] // If programId exists, exclude the "Program" column
      : [
          {
            accessorKey: "program",
            header: ({ column }: { column: Column<EventType, unknown> }) => (
              <DataTableColumnHeader column={column} title="Program" />
            ),
            cell: ({ row }: { row: Row<EventType> }) => {
              const program = row.original.program;

              if (!program) {
                return null;
              }

              return (
                <div className="flex items-center gap-2">
                  <span className="block capitalize truncate w-[100px] text-ellipsis">
                    {program.name}
                  </span>
                </div>
              );
            },
          },
        ]),
    {
      accessorKey: "assignedTo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Assigned To" />
      ),
      cell: ({ row }) => {
        const assignedUsers = row.original.assignedTo;

        if (!assignedUsers || assignedUsers.length === 0) {
          return <span className="text-muted-foreground text-sm">Unassigned</span>;
        }

        // If we have multiple assigned users, show the first with a count
        const firstUser = assignedUsers[0];
        const name = firstUser?.name || "";
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={firstUser?.profilePicture || ""} alt={name} />
              <AvatarFallback className={avatarColor}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="block text-ellipsis w-[100px] truncate">
                {name}
              </span>
              {assignedUsers.length > 1 && (
                <span className="text-xs text-muted-foreground">
                  +{assignedUsers.length - 1} more
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "dates",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dates" />
      ),
      cell: ({ row }) => {
        const startTime = row.original.startTime;
        const endTime = row.original.endTime;

        return (
          <div className="flex flex-col min-w-[150px] text-sm">
            {startTime && (
              <div className="flex items-center gap-1 truncate whitespace-nowrap">
                <Clock className="h-3 w-3 shrink-0" />
                <span className="truncate">From: {format(new Date(startTime), "PP")}</span>
              </div>
            )}
            {endTime && (
              <div className="flex items-center gap-1 truncate whitespace-nowrap">
                <Clock className="h-3 w-3 shrink-0" />
                <span className="truncate">To: {format(new Date(endTime), "PP")}</span>
              </div>
            )}
            {!startTime && !endTime && (
              <span className="text-muted-foreground">No dates set</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const statusValue = row.getValue("status") as string;
        const status = statuses.find(
          (status) => status.value === statusValue
        );

        if (!status) {
          return <span>{statusValue}</span>;
        }

        
        return (
          <div className="flex items-center">
            <Badge
              variant={StatusBadgeVariant(statusValue as EventStatusEnumType)}
              className="flex p-1 gap-1 !bg-transparent font-medium !shadow-none uppercase border-0"
            >
              <span>{status.label}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const priorityValue = row.getValue("priority") as string;
        const priority = priorities.find(
          (p) => p.value === priorityValue
        );

        if (!priority) {
          return <span>{priorityValue}</span>;
        }

        const priorityKey = formatStatusToEnum(
          priorityValue
        ) as EventPriorityEnumType;
        const Icon = priority.icon;

        if (!Icon) {
          return <span>{priority.label || priorityValue}</span>;
        }

        return (
          <div className="flex items-center">
            <Badge
              variant={EventPriorityEnum[priorityKey]}
              className="flex lg:w-[110px] p-1 gap-1 !bg-transparent font-medium !shadow-none uppercase border-0"
            >
              <Icon className="h-4 w-4 rounded-full text-inherit" />
              <span>{priority.label}</span>
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "registeredVolunteer",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Registered" />
      ),
      cell: ({ row }) => {
        const required = row.original.requiredVolunteer;
        const registered = row.original.registeredVolunteer;
        
        // Determine color based on registration status
        const textColor = registered >= required 
          ? "text-green-500 dark:text-green-400"
          : registered > 0 
            ? "text-amber-500 dark:text-amber-400"
            : "text-rose-500 dark:text-rose-400";
        
        return (
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${textColor}`}>
              {registered}
            </span>
            <span className="text-muted-foreground text-xs">
              / {required}
            </span>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "location",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Location" />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <span className="block lg:max-w-[150px] truncate text-sm">
    //         {row.original.location}
    //       </span>
    //     );
    //   },
    // },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <DataTableRowActions row={row} />
          </>
        );
      },
    },
  ];

  return columns;
};
