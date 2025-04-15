import * as React from "react";
import { Check, ChevronDown, Loader, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import useOrgId from "@/hooks/use-org-id";
import useCreateOrganizationDialog from "@/hooks/use-create-org-dialog";
import { useQuery } from "@tanstack/react-query";
import { getAllOrganizationsUserIsMemberQueryFn } from "@/lib/api";
import { OrganizationType } from "@/types/api.type";

type OrgType = {
  id: string;
  name: string;
  plan: string;
};

export function OrganizationSwitcher() {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const { onOpen } = useCreateOrganizationDialog();
  const orgId = useOrgId();

  const [activeOrg, setActiveOrg] = React.useState<OrgType>();

  const { data, isPending } = useQuery({
    queryKey: ["userOrgs"],
    queryFn: getAllOrganizationsUserIsMemberQueryFn,
    staleTime: 0,
    refetchOnMount: true,
  });

  const organizations = data?.organizations;

  React.useEffect(() => {
    if (organizations?.length) {
      const organization = orgId 
      ? organizations.find((org) => org._id === orgId) 
      : organizations[0];
      
      if (organization) {
        setActiveOrg({id: organization._id, name: organization.name, plan: "Free"});
        if (!orgId) navigate(`/organization/${organization._id}`);
      };
    };
  }, [orgId, organizations, navigate]);

  const onSelect = (org: OrganizationType) => {
    setActiveOrg({id: org._id, name: org.name, plan: "Free"});
    navigate(`/organization/${org._id}`);
  };

  return (
    <>
      <SidebarGroupLabel className="w-full justify-between pr-0">
        <span>Organizations</span>
        <button
          onClick={onOpen}
          className="flex size-5 items-center justify-center rounded-full border"
        >
          <Plus className="size-3.5" />
        </button>
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-gray-10"
              >
                { activeOrg ? 
                  (<>
                    <div className="flex aspect-square size-8 items-center font-semibold justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      {activeOrg?.name?.split(" ")?.[0]?.charAt(0)}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeOrg?.name}
                      </span>
                      <span className="truncate text-xs">
                        {activeOrg?.plan}
                      </span>
                    </div>
                  </>
                  ) : (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      No Organization selected
                    </span>
                  </div>
                 )}
                <ChevronDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Organizations
              </DropdownMenuLabel>
              {isPending ? <Loader className=" w-5 h-5 animate-spin" /> : null}
              
              {organizations?.map((organization) => (
                <DropdownMenuItem
                  key={organization._id}
                  onClick={() => onSelect(organization)}
                  className="gap-2 p-2 !cursor-pointer"
                >
                  <div className="flex w-6 h-6 items-center justify-center rounded-sm border">
                    {organization?.name?.split(" ")?.[0]?.charAt(0)}
                  </div>
                  {organization.name}

                  {organization._id === orgId && (
                    <DropdownMenuShortcut className="tracking-normal !opacity-100">
                      <Check className="w-4 h-4" />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2 !cursor-pointer"
                onClick={onOpen}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Create organization
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
