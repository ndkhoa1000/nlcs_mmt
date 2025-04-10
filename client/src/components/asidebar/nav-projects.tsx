import { ArrowRight, Folder, MoreHorizontal, Plus, Trash2 } from "lucide-react";
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
import useWorkspaceId from "@/hooks/use-workspace-id";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import { ConfirmDialog } from "../resuable/confirm-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { Button } from "../ui/button";

export function NavProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const { onOpen } = useCreateProjectDialog();
  const { context, open, onOpenDialog, onCloseDialog } = useConfirmDialog();

  const workspaceId = useWorkspaceId();

  const { isMobile } = useSidebar();

  const projects = [
    {
      id: "pro-383dh",
      name: "Chủ nhật xanh",
      emoji: "🌳",
      url: `/workspace/${workspaceId}/project/:pro-383dh`,
    },
    {
      id: "p383dh",
      name: "Tháng thanh niên",
      emoji: "📅",
      url: `/workspace/${workspaceId}/project/:p383dh`,
    },
    {
      id: "pro-wwhe",
      name: "Giáo dục văn hoá",
      emoji: "✈️",
      url: `/workspace/${workspaceId}/project/:pro-wwhe`,
    },
  ];

  const hasMore = true;

  const handleConfirm = () => {};
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="w-full justify-between pr-0">
          <span>Chương Trình</span>
          <button
            onClick={onOpen}
            type="button"
            className="flex size-5 items-center justify-center rounded-full border"
          >
            <Plus className="size-3.5" />
          </button>
        </SidebarGroupLabel>
        <SidebarMenu className="h-[320px] scrollbar overflow-y-auto pb-2">
          {projects?.length === 0 ? (
            <div className="pl-3">
              <p className="text-xs text-muted-foreground">
                Hiện chưa có chương trình nào trong tổ chức. Chương trình bạn tạo sẽ hiện ở đây.
              </p>
              <Button
                variant="link"
                type="button"
                className="h-0 p-0 text-[13px] underline font-semibold mt-4"
                onClick={onOpen}
              >
                Tạo chương trình
                <ArrowRight />
              </Button>
            </div>
          ) : (
            projects.map((item) => {
              const projectUrl = item.url;

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={projectUrl === pathname}>
                    <Link to={projectUrl}>
                      {item.emoji}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">Thêm</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem
                        onClick={() => navigate(`${projectUrl}`)}
                      >
                        <Folder className="text-muted-foreground" />
                        <span>Xem chương trình</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={false}
                        onClick={() => onOpenDialog(item)}
                      >
                        <Trash2 className="text-muted-foreground" />
                        <span>DXoá chương trình</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })
          )}

          {hasMore && (
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>Thêm</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      <ConfirmDialog
        isOpen={open}
        isLoading={false}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete ${
          context?.name || "this item"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
