"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { CommunicationPanel } from "@/components/layout/communication-panel";
import { Home, Briefcase, Settings, Users, DollarSign, Bell, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Mock roles for demonstration - replace with actual auth context
  const userRole = "Заказчик"; // or "Исполнитель", "Администратор"

  const getNavItems = (role: string) => {
    const commonItems = [
      { href: "/", label: "Dashboard", icon: Home },
      { href: "/settings", label: "Settings", icon: Settings },
    ];

    const clientItems = [
      { href: "/projects", label: "Projects", icon: Briefcase },
      { href: "/orders", label: "Orders", icon: Briefcase }, // Simplified for now
      { href: "/finance", label: "Finance", icon: DollarSign },
    ];

    const freelancerItems = [
      { href: "/find-orders", label: "Find Orders", icon: Briefcase },
      { href: "/my-bids", label: "My Bids", icon: DollarSign },
      { href: "/my-tasks", label: "My Tasks", icon: Briefcase },
      { href: "/finance", label: "Finance", icon: DollarSign },
    ];

    const adminItems = [
       { href: "/projects", label: "All Projects", icon: Briefcase },
       { href: "/orders", label: "All Orders", icon: Briefcase },
       { href: "/users", label: "Manage Users", icon: Users },
       { href: "/finance-admin", label: "Platform Finance", icon: DollarSign },
    ];

    switch (role) {
      case "Заказчик":
        return [...commonItems, ...clientItems];
      case "Исполнитель":
        return [...commonItems, ...freelancerItems];
      case "Администратор":
      case "Модератор":
        return [...commonItems, ...clientItems, ...freelancerItems, ...adminItems]; // Admins see everything
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems(userRole);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="items-center gap-2 p-4 border-b">
           {/* Placeholder for Logo/AppName */}
          <h1 className="text-xl font-semibold text-primary">TaskVerse</h1>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <ScrollArea className="h-full">
            <SidebarGroup className="p-2">
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} passHref legacyBehavior>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                        tooltip={item.label}
                      >
                        <a>
                          <item.icon />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
             {/* Add more groups if needed, e.g., for specific project navigation */}
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t">
          {/* User Profile Area - Placeholder */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              {userRole.charAt(0)}
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-medium">{userRole}</span>
               <span className="text-xs text-muted-foreground">user@example.com</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col flex-1 min-h-screen">
         <Header />
          <SidebarInset className="flex-1 overflow-auto p-4 md:p-6">
             {children}
           </SidebarInset>
      </div>
      <CommunicationPanel />
    </SidebarProvider>
  );
}
