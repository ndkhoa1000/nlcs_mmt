import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { TaskType } from "@/types/api.type";
import useOrgId from "@/hooks/use-org-id";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEventMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import EditEventDialog from "../edit-event-dialog";

interface DataTableRowActionsProps {
  row: Row<TaskType>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const queryClient = useQueryClient();
  const orgId = useOrgId();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ orgId, eventId }: { orgId: string; eventId: string }) => 
      deleteEventMutationFn(orgId, eventId),
  });
  
  const eventId = row.original._id as string;
  const eventTitle = row.original.title;
  const programId = row.original.program?._id;

  const handleConfirm = () => {
    mutate(
      {
        orgId,
        eventId,
      },
      {
        onSuccess: (data) => {
          // Fix: Use consistent query keys to match the table component
          queryClient.invalidateQueries({
            queryKey: ["events", orgId],
          });
          queryClient.invalidateQueries({
            queryKey: ["recentEvents", orgId],
          });
          // Also invalidate specific program events if applicable
          if (programId) {
            queryClient.invalidateQueries({
              queryKey: ["program-events", programId],
            });
            queryClient.invalidateQueries({
              queryKey: ["program-analysis", programId],
            });
          }
          
          toast({
            title: "Success",
            description: data.message,
            variant: "success",
          });
          setTimeout(() => setOpenDeleteDialog(false), 100);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setOpenEditDialog(true)}
          >
            Edit Event 
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={`!text-destructive cursor-pointer ${eventId}`}
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete Event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Event Dialog */}
      {openEditDialog && (
        <EditEventDialog
          isOpen={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          eventId={eventId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={openDeleteDialog}
        isLoading={isPending}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirm}
        title="Delete Event"
        description={`Are you sure you want to delete ${eventTitle}`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
