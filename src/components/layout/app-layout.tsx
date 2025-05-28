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
import {
  Home,
  Briefcase,
  Settings,
  Users,
  DollarSign,
  FileText,
  Search as SearchIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  // Состояние для раскрывающегося списка "Набор опций"
  const [isOptionsSetExpanded, setIsOptionsSetExpanded] = React.useState(() => {
    // Инициализируем состояние из localStorage, если оно доступно
    if (typeof window !== 'undefined') {
      return localStorage.getItem('optionsSetExpanded') === 'true';
    }
    return false;
  });

  React.useEffect(() => {
    // Check auth status from localStorage on mount
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const user: AuthUser = JSON.parse(storedUser);
        if (user && user.email && user.role) {
          setAuthUser(user);
        } else {
          // Invalid user data, redirect to auth
          localStorage.removeItem("authUser");
          router.replace("/auth");
        }
      } catch (error) {
        console.error("Error parsing authUser from localStorage", error);
        localStorage.removeItem("authUser");
        router.replace("/auth");
      }
    } else {
      // Not authenticated, redirect to auth
      router.replace("/auth");
    }
    setIsLoading(false);

    // Listen for storage changes to update layout if needed (e.g., logout)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "authUser") {
        if (event.newValue) {
          try {
            const updatedUser: AuthUser = JSON.parse(event.newValue);
            setAuthUser(updatedUser);
          } catch {
            setAuthUser(null);
            router.replace("/auth");
          }
        } else {
          setAuthUser(null);
          router.replace("/auth");
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  const handleLogout = () => {
    // Clear authentication state (localStorage in this case)
    localStorage.removeItem("authUser");
    // Show toast message
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // Redirect to auth page
    router.push("/auth");
    // Optional: Refresh to ensure layout updates if state isn't fully reactive
    // router.refresh();
  };

  // Определение типа для элемента меню
  type NavItem = {
    href: string;
    label: string;
    icon: React.FC<{ className?: string }>;
    roles?: UserRole[];
  };

  // Определение типа для групп меню
  type NavGroups = {
    main: NavItem[];
    users: NavItem[];
    finance: NavItem[];
    settings: NavItem[];
    optionsSet: NavItem[];
  };

  const getNavItems = (role: UserRole | undefined): NavGroups => {
    if (!role) return {
      main: [],
      users: [],
      finance: [],
      settings: [],
      optionsSet: []
    };

    // Define navigation groups
    const mainGroup: NavItem[] = [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      {
        href: "/projects",
        label: "Projects",
        icon: Briefcase,
        roles: ["Заказчик", "Администратор", "Модератор"],
      }, // Client/Admin/Mod
      {
        href: "/orders",
        label: "Orders",
        icon: FileText,
        roles: ["Заказчик", "Администратор", "Модератор"],
      }, // Client/Admin/Mod
      {
        href: "/tasks",
        label: "Tasks",
        icon: ClipboardList,
        roles: ["Заказчик", "Администратор", "Модератор", "Исполнитель"],
      }, // Example: Add Tasks page
    ];

    const userGroup: NavItem[] = [
      {
        href: "/users",
        label: "Manage Users",
        icon: Users,
        roles: ["Администратор", "Модератор"],
      }, // Admin/Mod only
      {
        href: "/find-orders",
        label: "Find Orders",
        icon: SearchIcon,
        roles: ["Исполнитель"],
      }, // Freelancer only
      {
        href: "/my-bids",
        label: "My Bids",
        icon: DollarSign,
        roles: ["Исполнитель"],
      }, // Freelancer only
      {
        href: "/my-tasks",
        label: "My Tasks",
        icon: Briefcase,
        roles: ["Исполнитель"],
      }, // Freelancer only
    ];

    const financeGroup: NavItem[] = [
      {
        href: "/finance",
        label: "Finance",
        icon: DollarSign,
        roles: ["Заказчик", "Исполнитель"],
      },
      {
        href: "/finance-admin",
        label: "Platform Finance",
        icon: DollarSign,
        roles: ["Администратор"],
      }, // Admin only
    ];

    const settingsGroup: NavItem[] = [
      { href: "/settings", label: "Settings", icon: Settings },
    ];

    // Группа "Набор опций" - видима только для администраторов
    const optionsSetGroup: NavItem[] = [
      {
        href: "/settings/projects",
        label: "Проекты",
        icon: Briefcase,
        roles: ["Администратор"],
      },
      {
        href: "/settings/orders",
        label: "Заказы",
        icon: FileText,
        roles: ["Администратор"],
      },
      {
        href: "/settings/stages",
        label: "Этапы",
        icon: ClipboardList,
        roles: ["Администратор"],
      },
      {
        href: "/settings/pricing-options",
        label: "Опции",
        icon: Settings,
        roles: ["Администратор"],
      },
      {
        href: "/settings/finance",
        label: "Финансы",
        icon: DollarSign,
        roles: ["Администратор"],
      },
    ];

    // Filter items based on role
    const filterByRole = <T extends NavItem>(items: T[]): T[] =>
      items.filter((item) => !item.roles || item.roles.includes(role));

    return {
      main: filterByRole(mainGroup),
      users: filterByRole(userGroup),
      finance: filterByRole(financeGroup),
      settings: filterByRole(settingsGroup),
      optionsSet: filterByRole(optionsSetGroup),
    };
  };

  const navItems = getNavItems(authUser?.role);

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        data-oid="ywtvalf"
      >
        Loading Layout...
      </div>
    );
  }

  if (!authUser) {
    // Should have been redirected, but as a fallback, render nothing or a message
    return null;
  }

  const userInitial = authUser.email
    ? authUser.email.charAt(0).toUpperCase()
    : "?";

  // Calculate dynamic right padding/margin for main content area based on communication panel state
  const rightMarginClass = isCommPanelExpanded ? "mr-80" : "mr-[70px]";

  return (
    <SidebarProvider defaultOpen data-oid="weuz7ng">
      {/* Left Sidebar */}
      <Sidebar data-oid="ruo3txl">
        <SidebarHeader
          className="h-[70px] items-center justify-center gap-2 px-6 border-b border-sidebar-border bg-sidebar-primary"
          data-oid="jnf0lp3"
        >
          <h1
            className="text-xl font-light tracking-wide text-sidebar-primary-foreground group-data-[state=expanded]:block hidden"
            data-oid="53--woj"
          >
            Freelan
            <span className="text-accent" data-oid="3kjd-:j">
              Center
            </span>{" "}
            {/* Updated text and color */}
          </h1>
          <h1
            className="text-xl font-light tracking-wide text-sidebar-primary-foreground group-data-[state=collapsed]:block hidden"
            data-oid=".21zq7t"
          >
            F
            <span className="text-accent" data-oid="atj4cfd">
              C
            </span>{" "}
            {/* Updated 'C' to accent color */}
          </h1>
        </SidebarHeader>
        <SidebarContent className="p-0 bg-white" data-oid="8zsjjpy">

          <ScrollArea className="h-full px-1" data-oid="b.3qdle">
            {navItems.main.length > 0 && (
              <SidebarGroup className="py-6 mb-0 group w-full group-data-[state=collapsed]:px-0.5 group-data-[state=expanded]:px-4" data-oid="7po_ei9">
                <SidebarGroupLabel
                  className="px-2 text-xs uppercase tracking-wider mb-2 text-muted-foreground group-data-[state=expanded]:block hidden"
                  data-oid="17d8ngt"
                >
                  Main
                </SidebarGroupLabel>
                {/* Hidden spacer for collapsed state */}
                <div className="h-8 group-data-[state=expanded]:hidden" />
                <SidebarMenu className="w-full group-data-[state=collapsed]:max-w-[54px] group-data-[state=collapsed]:!p-1.5 group-data-[state=collapsed]:flex group-data-[state=collapsed]:items-center group-data-[state=collapsed]:justify-center" data-oid="pjtbz5:">
                  {navItems.main.map((item) => (
                    <SidebarMenuItem key={item.href} data-oid="_2t.34j">
                      <Link
                        href={item.href}
                        passHref
                        legacyBehavior
                        data-oid="a6xzb52"
                      >
                        <SidebarMenuButton
                          asChild
                          isActive={
                            pathname.startsWith(item.href) &&
                            (item.href === "/dashboard"
                              ? pathname === "/dashboard"
                              : true)
                          } // Corrected isActive logic
                          tooltip={item.label}
                          variant="default" // Use default variant for styling
                          className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                          data-oid="0zvejxr"
                        >
                          <a className="rounded-[16px] w-full flex items-center justify-center group-data-[state=expanded]:justify-start group-data-[state=collapsed]:p-2 group-data-[state=collapsed]:mx-auto" data-oid="9scs5-2">
                            <item.icon data-oid="uy:dx-m" />
                            <span
                              className="group-data-[state=expanded]:inline hidden"
                              data-oid="0st:hoc"
                            >
                              {item.label}
                            </span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )}
            {navItems.users.length > 0 && (
              <SidebarGroup className="py-6 mb-0 group w-full group-data-[state=collapsed]:px-0.5 group-data-[state=expanded]:px-4" data-oid="pbl2:cq">
                <SidebarGroupLabel
                  className="px-2 text-xs uppercase tracking-wider mb-2 text-muted-foreground group-data-[state=expanded]:block hidden"
                  data-oid="wrmd-hv"
                >
                  Users
                </SidebarGroupLabel>
                {/* Hidden spacer for collapsed state */}
                <div className="h-8 group-data-[state=expanded]:hidden" />
                <SidebarMenu className="w-full group-data-[state=collapsed]:max-w-[54px] group-data-[state=collapsed]:!p-1.5 group-data-[state=collapsed]:flex group-data-[state=collapsed]:items-center group-data-[state=collapsed]:justify-center" data-oid="uz9l9v2">
                  {navItems.users.map((item) => (
                    <SidebarMenuItem key={item.href} data-oid="rxc4x8k">
                      <Link
                        href={item.href}
                        passHref
                        legacyBehavior
                        data-oid="idmqf3g"
                      >
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.startsWith(item.href)}
                          tooltip={item.label}
                          variant="default"
                          className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                          data-oid="zj8q:o8"
                        >
                          <a data-oid="6_trf2s">
                            <item.icon data-oid="dj2-:l0" />
                            <span
                              className="group-data-[state=expanded]:inline hidden"
                              data-oid="qgafte-"
                            >
                              {item.label}
                            </span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )}
            {navItems.finance.length > 0 && (
              <SidebarGroup className="py-6 mb-0 group w-full group-data-[state=collapsed]:px-0.5 group-data-[state=expanded]:px-4" data-oid="g80.855">
                <SidebarGroupLabel
                  className="px-2 text-xs uppercase tracking-wider mb-2 text-muted-foreground group-data-[state=expanded]:block hidden"
                  data-oid="eiof:m2"
                >
                  Finance
                </SidebarGroupLabel>
                {/* Hidden spacer for collapsed state */}
                <div className="h-8 group-data-[state=expanded]:hidden" />
                <SidebarMenu className="w-full group-data-[state=collapsed]:max-w-[54px] group-data-[state=collapsed]:!p-1.5 group-data-[state=collapsed]:flex group-data-[state=collapsed]:items-center group-data-[state=collapsed]:justify-center" data-oid="ko2qs56">
                  {navItems.finance.map((item) => (
                    <SidebarMenuItem key={item.href} data-oid="qflfqw4">
                      <Link
                        href={item.href}
                        passHref
                        legacyBehavior
                        data-oid="p.4f.:f"
                      >
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.startsWith(item.href)}
                          tooltip={item.label}
                          variant="default"
                          className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                          data-oid="ofkzwjp"
                        >
                          <a data-oid="90cf634">
                            <item.icon data-oid="ti:7ae9" />
                            <span
                              className="group-data-[state=expanded]:inline hidden"
                              data-oid="sd4gm40"
                            >
                              {item.label}
                            </span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )}
            {navItems.settings.length > 0 && (
              <SidebarGroup className="py-6 mb-0 group w-full group-data-[state=collapsed]:px-0.5 group-data-[state=expanded]:px-4" data-oid="hb_1j3m">
                <SidebarGroupLabel
                  className="px-2 text-xs uppercase tracking-wider mb-2 text-muted-foreground group-data-[state=expanded]:block hidden"
                  data-oid="s5wsuk-"
                >
                  Settings
                </SidebarGroupLabel>
                {/* Hidden spacer for collapsed state */}
                <div className="h-8 group-data-[state=expanded]:hidden" />
                <SidebarMenu className="w-full group-data-[state=collapsed]:max-w-[54px] group-data-[state=collapsed]:!p-1.5 group-data-[state=collapsed]:flex group-data-[state=collapsed]:items-center group-data-[state=collapsed]:justify-center" data-oid="2d_m8wv">
                  {/* Пункт меню Settings */}
                  {navItems.settings.map((item) => (
                    <SidebarMenuItem key={item.href} data-oid="pp3tdhp">
                      <Link
                        href={item.href}
                        passHref
                        legacyBehavior
                        data-oid=":y8:zza"
                      >
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.startsWith(item.href)}
                          tooltip={item.label}
                          variant="default"
                          className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                          data-oid="0pnxs7w"
                        >
                          <a data-oid="vkzwjqt">
                            <item.icon data-oid="a6dsboc" />
                            <span
                              className="group-data-[state=expanded]:inline hidden"
                              data-oid="mdot-nj"
                            >
                              {item.label}
                            </span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                  
                  {/* Раскрывающаяся группа "Набор опций" внутри группы Settings */}
                  {navItems.optionsSet && navItems.optionsSet.length > 0 && (
                    <>
                      <SidebarMenuItem data-oid="options-set-dropdown-item">
                        <div 
                          onClick={() => {
                            const isExpanded = localStorage.getItem('optionsSetExpanded') === 'true';
                            localStorage.setItem('optionsSetExpanded', (!isExpanded).toString());
                            setIsOptionsSetExpanded(!isExpanded);
                          }}
                          className="flex w-full items-center justify-between gap-2 overflow-hidden rounded-2xl p-2 text-left cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-10 text-sm text-sidebar-foreground"
                          data-oid="options-set-dropdown-header"
                        >
                          <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            <span className="group-data-[state=expanded]:inline hidden">Набор опций</span>
                          </div>
                          {isOptionsSetExpanded ? (
                            <ChevronUp className="h-4 w-4" data-oid="options-set-chevron-up" />
                          ) : (
                            <ChevronDown className="h-4 w-4" data-oid="options-set-chevron-down" />
                          )}
                        </div>
                      </SidebarMenuItem>
                      
                      {/* Пункты меню внутри раскрывающегося списка */}
                      {isOptionsSetExpanded && navItems.optionsSet.map((item) => (
                        <SidebarMenuItem key={item.href} data-oid={`options-set-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                          <Link
                            href={item.href}
                            passHref
                            legacyBehavior
                            data-oid={`options-set-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <SidebarMenuButton
                              asChild
                              isActive={pathname.startsWith(item.href)}
                              tooltip={item.label}
                              variant="default"
                              className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground pl-6"
                              data-oid={`options-set-button-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <a data-oid={`options-set-anchor-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                                <item.icon data-oid={`options-set-icon-${item.label.toLowerCase().replace(/\s+/g, '-')}`} />
                                <span
                                  className="group-data-[state=expanded]:inline hidden"
                                  data-oid={`options-set-text-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                  {item.label}
                                </span>
                              </a>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      ))}
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroup>
            )}
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter
          className="p-4 border-t border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground group-data-[state=expanded]:flex hidden items-center justify-between gap-2"
          data-oid="4jmrjw9"
        >
          <div
            className="flex items-center justify-between w-full gap-2"
            data-oid="user-info-container"
          >
            <div className="flex items-center gap-2 flex-grow min-w-0">
              <Avatar className="h-10 w-10 shrink-0" data-oid=":0ptezt">
                <AvatarFallback
                  className="bg-white/20 text-sidebar-primary-foreground"
                  data-oid="_muzr.x"
                >
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow min-w-0" data-oid="ub95w4q">
                <p className="text-base font-medium text-white truncate" data-oid="w3axjnx">
                  {authUser.role}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-primary-foreground hover:bg-white/10 h-10 w-10 rounded-full"
              onClick={handleLogout}
              aria-label="Logout"
              data-oid="q90b:0u"
            >
              <LogOut className="h-5 w-5" data-oid="yi-jqfs" />
            </Button>
          </div>
        </SidebarFooter>
        <SidebarFooter
          className="p-4 border-t border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground group-data-[state=collapsed]:flex hidden justify-center"
          data-oid="8d8efmp"
        >
          <Avatar className="h-10 w-10" data-oid="4xvik55">
            <AvatarFallback
              className="bg-white/20 text-sidebar-primary-foreground"
              data-oid="hns6up4"
            >
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </SidebarFooter>
        {/* Custom Toggle Button */}
        <SidebarTrigger asChild data-oid="wvu7d18">
          <button
            className="absolute -right-3 top-20 bg-background rounded-full p-1 shadow-md border border-border text-muted-foreground hover:text-primary cursor-pointer z-30"
            data-oid="1bl1i2w"
          >
            <ChevronLeft
              className="h-5 w-5 group-data-[state=collapsed]:hidden"
              data-oid="4y1x19."
            />

            <ChevronRight
              className="h-5 w-5 group-data-[state=expanded]:hidden"
              data-oid="vpwxgjv"
            />
          </button>
        </SidebarTrigger>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen" data-oid="sybm61z">
        {/* Pass user info to Header */}
        <Header
          userEmail={authUser.email}
          userRole={authUser.role}
          data-oid="a5jqxfm"
        />

        {/* Adjusted margin/padding for main content based on sidebar and communication panel state */}
        <SidebarInset
          className={cn(
            "flex-1 overflow-auto p-8 md:p-8 transition-all duration-300",
            // Left margin based on left sidebar state
            "group-data-[state=expanded]/sidebar-wrapper:ml-64 group-data-[state=collapsed]/sidebar-wrapper:ml-[70px]",
            // Right margin based on communication panel state
            rightMarginClass,
          )}
          data-oid="c5_4zlc"
        >
          {children}
        </SidebarInset>
      </div>

      {/* Communication Panel */}
      <CommunicationPanel
        isExpanded={isCommPanelExpanded}
        setIsExpanded={setIsCommPanelExpanded}
        data-oid="5x5q0vu"
      />
    </SidebarProvider>
  );
}
