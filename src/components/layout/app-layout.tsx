
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
} from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { CommunicationPanel } from "@/components/layout/communication-panel";
import { Home, Briefcase, Settings, Users, DollarSign, FileText, Search as SearchIcon, LogOut, ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserRole } from "@/lib/types"; // Use type import
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Import Button
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface AuthUser {
  email: string;
  role: UserRole;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast(); // Initialize useToast
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  // Default communication panel to collapsed (width 70px)
  const [isCommPanelExpanded, setIsCommPanelExpanded] = React.useState(false);

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

  const handleLogout = () => {
    // Clear authentication state (localStorage in this case)
    localStorage.removeItem('authUser');
    // Show toast message
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // Redirect to auth page
    router.push('/auth');
    // Optional: Refresh to ensure layout updates if state isn't fully reactive
    // router.refresh();
  };


  const getNavItems = (role: UserRole | undefined) => {
    if (!role) return [];

    // Define navigation groups
    const mainGroup = [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/projects", label: "Projects", icon: Briefcase, roles: ["Заказчик", "Администратор", "Модератор"] }, // Client/Admin/Mod
      { href: "/orders", label: "Orders", icon: FileText, roles: ["Заказчик", "Администратор", "Модератор"] }, // Client/Admin/Mod
      { href: "/tasks", label: "Tasks", icon: ClipboardList, roles: ["Заказчик", "Администратор", "Модератор", "Исполнитель"] }, // Example: Add Tasks page
    ];

    const userGroup = [
      { href: "/users", label: "Manage Users", icon: Users, roles: ["Администратор", "Модератор"] }, // Admin/Mod only
      { href: "/find-orders", label: "Find Orders", icon: SearchIcon, roles: ["Исполнитель"]}, // Freelancer only
      { href: "/my-bids", label: "My Bids", icon: DollarSign, roles: ["Исполнитель"]}, // Freelancer only
      { href: "/my-tasks", label: "My Tasks", icon: Briefcase, roles: ["Исполнитель"]}, // Freelancer only
    ];

    const financeGroup = [
       { href: "/finance", label: "Finance", icon: DollarSign, roles: ["Заказчик", "Исполнитель"] },
       { href: "/finance-admin", label: "Platform Finance", icon: DollarSign, roles: ["Администратор"] }, // Admin only
    ];

    const settingsGroup = [
       { href: "/settings", label: "Settings", icon: Settings },
    ];

    // Filter items based on role
    const filterByRole = (items: any[]) => items.filter(item => !item.roles || item.roles.includes(role));

    return {
        main: filterByRole(mainGroup),
        users: filterByRole(userGroup),
        finance: filterByRole(financeGroup),
        settings: filterByRole(settingsGroup),
    };
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

  // Calculate dynamic right padding/margin for main content area based on communication panel state
  const rightMarginClass = isCommPanelExpanded ? 'mr-80' : 'mr-[70px]';

  return (
    <SidebarProvider defaultOpen>
      {/* Left Sidebar */}
      <Sidebar>
        <SidebarHeader className="h-[70px] items-center justify-center gap-2 px-6 border-b border-sidebar-border bg-sidebar-primary">
           <h1 className="text-xl font-light tracking-wide text-sidebar-primary-foreground group-data-[state=expanded]:block hidden">
            Freelan<span className="text-accent">Center</span> {/* Updated text and color */}
           </h1>
           <h1 className="text-xl font-light tracking-wide text-sidebar-primary-foreground group-data-[state=collapsed]:block hidden">
             F<span className="text-accent">C</span> {/* Updated 'C' to accent color */}
           </h1>
        </SidebarHeader>
        <SidebarContent className="p-0 bg-white">
          <ScrollArea className="h-full">
            {navItems.main.length > 0 && (
                <SidebarGroup className="px-4 py-6 mb-0">
                    <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wider mb-2 text-muted-foreground group-data-[state=expanded]:block hidden">Main</SidebarGroupLabel>
                    <SidebarMenu>
                        {navItems.main.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href} passHref legacyBehavior>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === '/dashboard' : true)} // Corrected isActive logic
                                tooltip={item.label}
                                variant="default" // Use default variant for styling
                                className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                            >
                                <a>
                                <item.icon />
                                <span className="group-data-[state=expanded]:inline hidden">{item.label}</span>
                                </a>
                            </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            )}
            {navItems.users.length > 0 && (
                 <SidebarGroup className="px-4 py-6 mb-0">
                    <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wider mb-2 text-muted-foreground group-data-[state=expanded]:block hidden">Users</SidebarGroupLabel>
                    <SidebarMenu>
                        {navItems.users.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href} passHref legacyBehavior>
                             <SidebarMenuButton
                                asChild
                                isActive={pathname.startsWith(item.href)}
                                tooltip={item.label}
                                variant="default"
                                className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                            >
                                <a>
                                <item.icon />
                                <span className="group-data-[state=expanded]:inline hidden">{item.label}</span>
                                </a>
                            </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            )}
            {navItems.finance.length > 0 && (
                 <SidebarGroup className="px-4 py-6 mb-0">
                    <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wider mb-2 text-muted-foreground group-data-[state=expanded]:block hidden">Finance</SidebarGroupLabel>
                    <SidebarMenu>
                        {navItems.finance.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href} passHref legacyBehavior>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname.startsWith(item.href)}
                                tooltip={item.label}
                                variant="default"
                                className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                            >
                                <a>
                                <item.icon />
                                <span className="group-data-[state=expanded]:inline hidden">{item.label}</span>
                                </a>
                            </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            )}
             {navItems.settings.length > 0 && (
                 <SidebarGroup className="px-4 py-6 mb-0">
                    <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wider mb-2 text-muted-foreground group-data-[state=expanded]:block hidden">Settings</SidebarGroupLabel>
                    <SidebarMenu>
                        {navItems.settings.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href} passHref legacyBehavior>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname.startsWith(item.href)}
                                tooltip={item.label}
                                variant="default"
                                className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                            >
                                <a>
                                <item.icon />
                                <span className="group-data-[state=expanded]:inline hidden">{item.label}</span>
                                </a>
                            </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
             )}
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground group-data-[state=expanded]:flex hidden items-center justify-between gap-2">
           <div className="flex items-center gap-2 flex-grow min-w-0"> {/* Added flex-grow and min-w-0 */}
             <Avatar className="h-10 w-10 shrink-0"> {/* Added shrink-0 */}
                 <AvatarFallback className="bg-white/20 text-sidebar-primary-foreground">{userInitial}</AvatarFallback>
             </Avatar>
             <div className="flex-grow min-w-0"> {/* Added flex-grow and min-w-0 */}
               <p className="text-sm font-light truncate">{authUser.email}</p> {/* Added truncate */}
               <p className="text-xs text-muted-foreground">{authUser.role}</p> {/* Use text-muted-foreground */}
             </div>
           </div>
           <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-primary-foreground hover:bg-white/10 shrink-0" // Added shrink-0
              onClick={handleLogout}
              aria-label="Logout"
           >
             <LogOut className="h-5 w-5" />
           </Button>
        </SidebarFooter>
        <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground group-data-[state=collapsed]:flex hidden justify-center">
            <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-white/20 text-sidebar-primary-foreground">{userInitial}</AvatarFallback>
            </Avatar>
        </SidebarFooter>
        {/* Custom Toggle Button */}
         <SidebarTrigger asChild>
             <button className="absolute -right-3 top-20 bg-background rounded-full p-1 shadow-md border border-border text-muted-foreground hover:text-primary cursor-pointer z-30">
                 <ChevronLeft className="h-5 w-5 group-data-[state=collapsed]:hidden" />
                 <ChevronRight className="h-5 w-5 group-data-[state=expanded]:hidden" />
             </button>
         </SidebarTrigger>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen">
         {/* Pass user info to Header */}
         <Header userEmail={authUser.email} userRole={authUser.role} />
          {/* Adjusted margin/padding for main content based on sidebar and communication panel state */}
          <SidebarInset
            className={cn(
              "flex-1 overflow-auto p-8 md:p-8 transition-all duration-300",
              // Left margin based on left sidebar state
              "group-data-[state=expanded]/sidebar-wrapper:ml-64 group-data-[state=collapsed]/sidebar-wrapper:ml-[70px]",
              // Right margin based on communication panel state
              rightMarginClass
            )}
          >
             {children}
           </SidebarInset>
      </div>

      {/* Communication Panel */}
      <CommunicationPanel
        isExpanded={isCommPanelExpanded}
        setIsExpanded={setIsCommPanelExpanded}
      />
    </SidebarProvider>
  );
}
