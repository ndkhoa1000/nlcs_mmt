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

type ItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export function NavMain() {
  const orgId = useOrgId();
  const location = useLocation();

  const pathname = location.pathname;

  const items: ItemType[] = [
    {
      title: "Dashboard",
      url: `/organization/${orgId}`,
      icon: LayoutDashboard,
    },
    {
      title: "Tasks",
      url: `/oganization/${orgId}/tasks`,
      icon: CheckCircle,
    },
    {
      title: "Members",
      url: `/oganization/${orgId}/members`,
      icon: Users,
    },

    {
      title: "Settings",
      url: `/oganization/${orgId}/settings`,
      icon: Settings,
    },
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
