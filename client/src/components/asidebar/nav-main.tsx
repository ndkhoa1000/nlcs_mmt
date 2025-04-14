"use client";

import {
  LucideIcon,
  Settings,
  Users,
  CheckCircle,
  LayoutDashboard,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import useOrgId from "@/hooks/use-org-id";
import { useAuthContext } from "@/context/auth-provider";
import { Permissions } from "@/constant";

type ItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export function NavMain() {
  const {hasPermission} = useAuthContext();
  const orgId = useOrgId();
  const location = useLocation();
  const pathname = location.pathname;

  const canManageOrgSettings = hasPermission(Permissions.MANAGE_ORGANIZATION_SETTINGS);
  const items: ItemType[] = [
    {
      title: "Dashboard",
      url: `/organization/${orgId}`,
      icon: LayoutDashboard,
    },
    {
      title: "Events",
      url: `/organization/${orgId}/events`,
      icon: CheckCircle,
    },
    {
      title: "Members",
      url: `/organization/${orgId}/members`,
      icon: Users,
    },
    ...(canManageOrgSettings ?[
      {
        title: "Settings",
        url: `/organization/${orgId}/settings`,
        icon: Settings,
      },
    ]:[])
  ];
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton isActive={item.url === pathname} asChild>
              <Link to={item.url} className="!text-[15px]">
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
