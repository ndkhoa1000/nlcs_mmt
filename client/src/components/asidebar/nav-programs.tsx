import { ArrowRight, Folder, Loader, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useOrgId from "@/hooks/use-org-id";
import useCreateProgramDialog from "@/hooks/use-create-project-dialog";
import { ConfirmDialog } from "../resuable/confirm-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { Button } from "../ui/button";
import PermissionsGuard from "../resuable/permission-guard";
import { Permissions } from "@/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProgramMutationFn } from "@/lib/api";
import { useState } from "react";
import useGetProgramsInOrganizationQuery from "@/hooks/api/use-get-programs";
import { PaginationType } from "@/types/api.type";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback} from "@radix-ui/react-avatar";

export function NavPrograms() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const { onOpen } = useCreateProgramDialog();
  const { context, open, onOpenDialog, onCloseDialog } = useConfirmDialog();
  const { isMobile } = useSidebar();

  const queryClient = useQueryClient();
  const orgId = useOrgId();

  const [pageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: ({ orgId, programId }: { orgId: string; programId: string }) =>
      deleteProgramMutationFn(orgId, programId),
  });

  const { data, isPending, isFetching, isError } =
    useGetProgramsInOrganizationQuery({
      orgId,
      pageSize,
      pageNumber,
    });
    
  const programs = data?.programs || [];
  const pagination = data?.pagination || ({} as PaginationType);
  const hasMore = pagination.totalCount > programs.length;

  const fetchNextPage = () => {
    if (!hasMore || isFetching) return;
    setPageSize((prev) => prev + 5);
  };

  const handleConfirm = () => {
    if (!context) return;
    mutate(
      {
        orgId,
        programId: context?._id,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["allPrograms", orgId],
          });
          toast({
            title: "Success",
            description: data.message,
            variant: "success",
          });

          navigate(`/organization/${orgId}`);
          setTimeout(() => onCloseDialog(), 100);
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
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="w-full justify-between pr-0">
          <span>Programs</span>

          <PermissionsGuard requiredPermission={Permissions.CREATE_PROGRAM}>
            <button
              onClick={onOpen}
              type="button"
              className="flex size-5 items-center justify-center rounded-full border"
            >
              <Plus className="size-3.5" />
            </button>
          </PermissionsGuard>
        </SidebarGroupLabel>
        <SidebarMenu className="h-[320px] scrollbar overflow-y-auto pb-2">
          {isError ? <div>Error occurred</div> : null}
          {isPending ? (
            <Loader
              className=" w-5 h-5
             animate-spin
              place-self-center"
            />
          ) : null}

          {!isPending && programs?.length === 0 ? (
            <div className="pl-3">
              <p className="text-xs text-muted-foreground">
                There is no program in this Organization yet. Programs you create
                will show up here.
              </p>
              <PermissionsGuard requiredPermission={Permissions.CREATE_PROGRAM}>
                <Button
                  variant="link"
                  type="button"
                  className="h-0 p-0 text-[13px] underline font-semibold mt-4"
                  onClick={onOpen}
                >
                  Create a program
                  <ArrowRight />
                </Button>
              </PermissionsGuard>
            </div>
          ) : (
            programs.map((program) => {
              const programUrl = `/organization/${orgId}/program/${program._id}`;

                return (
                <SidebarMenuItem key={program._id}>
                  <SidebarMenuButton asChild isActive={programUrl === pathname}>
                  <Link to={programUrl} className="h-6 w-6 flex items-center gap-2">
                    <Avatar className="p-1 px-2 rounded-md bg-gray-300 text-xs font-bold flex items-center justify-center">
                      <AvatarFallback className="flex items-center justify-center ">
                      {program.name?.split(" ")?.[0]?.toUpperCase().charAt(0) ||""}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{program.name}</span>
                  </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem onClick={() => navigate(programUrl)}>
                    <Folder className="mr-2 text-muted-foreground" />
                    View Program
                    </DropdownMenuItem>
                    <PermissionsGuard
                    requiredPermission={Permissions.DELETE_PROGRAM}
                    >
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={isLoading}
                      onClick={() => onOpenDialog(program)}
                    >
                      <Trash2 className="mr-2 text-muted-foreground" />
                      Delete Program
                    </DropdownMenuItem>
                    </PermissionsGuard>
                  </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
                );
            })
          )}

          {hasMore && (
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-sidebar-foreground/70"
                disabled={isFetching}
                onClick={fetchNextPage}
              >
                {isFetching ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="text-sidebar-foreground/70" />
                )}
                <span>{isFetching ? "Loading..." : "Show More"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      <ConfirmDialog
        isOpen={open}
        isLoading={isLoading}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title="Delete Program"
        description={`Are you sure you want to delete ${
          context?.name || "this program"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
