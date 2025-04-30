
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
import { Home, Briefcase, Settings, Users, DollarSign, Bell, MessageSquare, Search as SearchIcon, FileText } from "lucide-react"; // Renamed Search icon import
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/types"; // Use type import
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AuthUser {
  email: string;
  role: UserRole;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Check auth status from localStorage on mount
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        const user: AuthUser = JSON.parse(storedUser);
        if (user && user.email && user.role) {
          setAuthUser(user);
        } else {
          // Invalid user data, redirect to auth
          localStorage.removeItem('authUser');
          router.replace('/auth');
        }
      } catch (error) {
        console.error("Error parsing authUser from localStorage", error);
        localStorage.removeItem('authUser');
        router.replace('/auth');
      }
    } else {
      // Not authenticated, redirect to auth
      router.replace('/auth');
    }
    setIsLoading(false);

    // Listen for storage changes to update layout if needed (e.g., logout)
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'authUser') {
            if (event.newValue) {
                try {
                    const updatedUser: AuthUser = JSON.parse(event.newValue);
                    setAuthUser(updatedUser);
                } catch {
                    setAuthUser(null);
                    router.replace('/auth');
                }
            } else {
                setAuthUser(null);
                router.replace('/auth');
            }
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, [router]);


  const getNavItems = (role: UserRole | undefined) => {
    if (!role) return [];

    const commonItems = [
      { href: "/dashboard", label: "Dashboard", icon: Home }, // Ensure dashboard is first/default
      { href: "/settings", label: "Settings", icon: Settings },
    ];

    const clientItems = [
      { href: "/projects", label: "Projects", icon: Briefcase },
      { href: "/orders", label: "Orders", icon: FileText }, // Changed icon for Orders
      { href: "/finance", label: "Finance", icon: DollarSign },
    ];

    const freelancerItems = [
      { href: "/find-orders", label: "Find Orders", icon: SearchIcon }, // Use imported SearchIcon
      { href: "/my-bids", label: "My Bids", icon: DollarSign }, // Consider a different icon if needed
      { href: "/my-tasks", label: "My Tasks", icon: Briefcase }, // Changed icon for Tasks
      { href: "/finance", label: "Finance", icon: DollarSign },
    ];

    const adminItems = [
      // Maybe merge/refine these for admins
       { href: "/projects", label: "All Projects", icon: Briefcase },
       { href: "/orders", label: "All Orders", icon: FileText },
       { href: "/users", label: "Manage Users", icon: Users },
       { href: "/finance-admin", label: "Platform Finance", icon: DollarSign },
    ];

    let specificItems: typeof commonItems = [];
    switch (role) {
      case "Заказчик":
        specificItems = clientItems;
        break;
      case "Исполнитель":
        specificItems = freelancerItems;
        break;
      case "Администратор":
      case "Модератор": // Combine Admin and Moderator nav for now
        // Show a combined view or prioritize admin sections
        specificItems = adminItems; // Simple approach: show only admin items for admins/mods
        break;
    }
    // Ensure dashboard is always present and potentially other commons
    return [...commonItems, ...specificItems.filter(item => !commonItems.some(c => c.href === item.href))];
  };

  const navItems = getNavItems(authUser?.role);

  if (isLoading) {
     return <div className="flex min-h-screen items-center justify-center">Loading Layout...</div>;
  }

  if (!authUser) {
     // Should have been redirected, but as a fallback, render nothing or a message
     return null;
  }

  const userInitial = authUser.email ? authUser.email.charAt(0).toUpperCase() : '?';

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
                        // More robust active state check: exact match for '/' and prefix match otherwise
                        isActive={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
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
          <div className="flex items-center gap-2">
             <Avatar className="h-8 w-8">
                 {/* Add AvatarImage if available */}
                 <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
               <span className="text-sm font-medium truncate">{authUser.role}</span>
               <span className="text-xs text-muted-foreground truncate" title={authUser.email}>{authUser.email}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col flex-1 min-h-screen">
         {/* Pass user info to Header */}
         <Header userEmail={authUser.email} userRole={authUser.role} />
          <SidebarInset className="flex-1 overflow-auto p-4 md:p-6 lg:pr-[19rem] "> {/* Adjust right padding for communication panel */}
             {children}
           </SidebarInset>
      </div>
      <CommunicationPanel />
    </SidebarProvider>
  );
}
