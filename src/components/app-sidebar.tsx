import * as React from "react";

import { SearchForm } from "@/components/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  adminRoute: [
    {
      title: "Admin Analytics",
      url: "#",
      items: [
        {
          title: "User",
          url: "/dashboard/user",
        },
        {
          title: "Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Providers",
          url: "/dashboard/providers",
        },
      ],
    },

  ],
  providerRoute: [
    {
      title: "Provider Analytics",
      url: "#",
      items: [
        {
          title: "Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Menu",
          url: "/dashboard/menu",
        },
      ],
    },

  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {role} = props
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {role === "ADMIN" && data.adminRoute.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild >
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
