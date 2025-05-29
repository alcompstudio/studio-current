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
  Ruler as Scale,
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
  // Стили для анимации раскрытия/сворачивания группы меню
  const menuAnimationStyles = {
    menuItem: "transition-all duration-300 ease-in-out overflow-hidden",
    menuItemOpen: "max-h-20 opacity-100 transform translate-y-0",
    menuItemClosed: "max-h-0 opacity-0 transform -translate-y-2",
    menuGroup: "transition-all duration-300 ease-in-out overflow-hidden",
    chevron: "transition-transform duration-300 ease-in-out",
    chevronOpen: "transform rotate-180",
  };
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast(); // Initialize useToast
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  // Default communication panel to collapsed (width 70px)
  const [isCommPanelExpanded, setIsCommPanelExpanded] = React.useState(false);
  // Ссылки на DOM элементы для прокрутки
  const optionsSetRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  
  // Состояние для раскрывающегося списка "Набор опций"
  const [isOptionsSetExpanded, setIsOptionsSetExpanded] = React.useState(() => {
    // Инициализируем состояние из localStorage, если оно доступно
    if (typeof window !== "undefined") {
      return localStorage.getItem("optionsSetExpanded") === "true";
    }
    return false;
  });
  
  // Calculate right margin class based on communication panel state
  const rightMarginClass = isCommPanelExpanded 
    ? "mr-80" 
    : "mr-[70px]";

  // Функция для принудительной прокрутки меню "Набор опций"
  const scrollToOptionsButton = React.useCallback(() => {
    // Используем несколько задержек для гарантии обновления DOM
    let attempts = 0;
    const maxAttempts = 5;
    
    // Функция попытки прокрутки
    const tryScroll = () => {
      attempts++;
      console.log(`ScrollToOptionsButton attempt ${attempts}...`);
      
      if (!scrollAreaRef.current) {
        console.log('ScrollArea ref not found!');
        if (attempts < maxAttempts) {
          setTimeout(tryScroll, 50);
        }
        return;
      }
      
      // Находим кнопку "Набор опций" и viewport прокрутки
      const optionsButton = document.querySelector('div[data-oid="l-j964n"]');
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      
      if (!optionsButton || !viewport) {
        console.log('Options button or viewport not found!', { optionsButton, viewport });
        if (attempts < maxAttempts) {
          setTimeout(tryScroll, 50);
        }
        return;
      }
      
      // Получаем абсолютную позицию кнопки
      const buttonRect = optionsButton.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      
      // Желаемая позиция от верхнего края viewport
      const targetTopOffset = 86;
      
      // Текущая позиция относительно видимой области
      const currentTopOffset = buttonRect.top - viewportRect.top;
      
      // Разница между текущей и желаемой позициями
      const scrollDelta = currentTopOffset - targetTopOffset;
      
      // Текущая позиция скролла
      const currentScrollTop = (viewport as HTMLElement).scrollTop;
      const targetScrollPosition = currentScrollTop + scrollDelta;
      
      console.log('Scroll calculation:', { 
        currentTopOffset, 
        targetTopOffset, 
        scrollDelta, 
        currentScrollTop, 
        targetScrollPosition 
      });
      
      // Проверяем, нужна ли прокрутка (если разница слишком мала, можно пропустить)
      if (Math.abs(scrollDelta) > 5) {
        if ('scrollTo' in viewport) {
          // Выполняем прокрутку с использованием анимации
          viewport.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth' as ScrollBehavior
          });
          
          console.log('Scroll performed to position:', targetScrollPosition);
          
          // Проверяем, что прокрутка работает корректно
          setTimeout(() => {
            const newButtonRect = optionsButton.getBoundingClientRect();
            const newViewportRect = viewport.getBoundingClientRect();
            const newOffset = newButtonRect.top - newViewportRect.top;
            console.log('After scroll position check:', { newOffset, targetTopOffset });
          }, 500);
        } else {
          console.warn('scrollTo not available on viewport');  
        }
      } else {
        console.log('No scroll needed, already at good position');
      }
    };
    
    // Запускаем первую попытку с небольшой задержкой
    setTimeout(tryScroll, 50);
  }, [scrollAreaRef]);

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
    if (!role)
      return {
        main: [],
        users: [],
        finance: [],
        settings: [],
        optionsSet: [],
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
        href: "/settings/measurement-units",
        label: "Ед. изм",
        icon: Scale,
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
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="animate-pulse">
          <div className="h-12 w-48 bg-muted rounded-md mb-4" />
          <div className="h-4 w-36 bg-muted rounded-md" />
        </div>
      </div>
    );
  }

  if (!authUser) {
    // This should rarely happen - useEffect should redirect if not authenticated
    router.replace("/auth");
    return null;
  }

  // Get initials for avatar
  const userInitial = authUser.email
    ? authUser.email.charAt(0).toUpperCase()
    : "U";

  // rightMarginClass уже объявлен выше

  return (
    <SidebarProvider defaultOpen data-oid="5vjnhht">
      {/* Left Sidebar */}
      <Sidebar data-oid="e1evjkk">
        <SidebarHeader
          className="h-[70px] items-center justify-center gap-2 px-6 border-b border-sidebar-border bg-sidebar-primary"
          data-oid="s9y5mc6"
        >
          <h1
            className="text-xl font-light tracking-wide text-sidebar-primary-foreground group-data-[state=expanded]:block hidden"
            data-oid="b8gne7h"
          >
            Freelan
            <span className="text-accent" data-oid="abblnl3">
              Center
            </span>{" "}
            {/* Updated text and color */}
          </h1>
          <h1
            className="text-xl font-light tracking-wide text-sidebar-primary-foreground group-data-[state=collapsed]:block hidden"
            data-oid="sg9ny2m"
          >
            F
            <span className="text-accent" data-oid="bhhupq5">
              C
            </span>{" "}
            {/* Updated 'C' to accent color */}
          </h1>
        </SidebarHeader>
        <SidebarContent className="p-0 bg-white" data-oid=":qfyhdc">
          <ScrollArea className="h-full px-1" data-oid=":xw-r6s" ref={scrollAreaRef}>
            {navItems.main.length > 0 && (
              <SidebarGroup
                className="py-6 mb-0 group w-full group-data-[state=collapsed]:px-0.5 group-data-[state=expanded]:px-4"
                data-oid="1p0.rm4"
              >
                {/* Контейнер для заголовка и кнопки в развёрнутом состоянии */}
                <div className="flex justify-between items-center mb-2 group-data-[state=collapsed]:hidden">
                  <SidebarGroupLabel
                    className="px-2 text-xs uppercase tracking-wider text-muted-foreground"
                    data-oid="c.almyi"
                  >
                    Main
                  </SidebarGroupLabel>
                  <SidebarTrigger asChild data-oid="8uj3a4z">
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-l-full rounded-r-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent text-muted-foreground hover:text-primary cursor-pointer h-auto w-auto p-1"
                      data-oid="8haztoe"
                    >
                      <ChevronLeft
                        className="h-5 w-5"
                        data-oid="he.tsbk"
                      />
                    </button>
                  </SidebarTrigger>
                </div>
                
                {/* Контейнер для кнопки в свёрнутом состоянии */}
                <div className="flex justify-center items-center h-8 mb-2 group-data-[state=expanded]:hidden">
                  <SidebarTrigger asChild data-oid="collapsed-trigger">
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-l-full rounded-r-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent text-muted-foreground hover:text-primary cursor-pointer h-auto w-auto p-1"
                      data-oid="collapsed-button"
                    >
                      <ChevronRight
                        className="h-5 w-5"
                        data-oid="collapsed-icon"
                      />
                    </button>
                  </SidebarTrigger>
                </div>
                {/* Удален пустой блок-разделитель, т.к. кнопка уже есть выше */}

                <SidebarMenu
                  className="w-full group-data-[state=collapsed]:max-w-[54px] group-data-[state=collapsed]:!p-1.5 group-data-[state=collapsed]:flex group-data-[state=collapsed]:items-center group-data-[state=collapsed]:justify-center"
                  data-oid="i5pg7bn"
                >
                  {navItems.main.map((item) => (
                    <SidebarMenuItem key={item.href} data-oid="pzekmsm">
                      <Link
                        href={item.href}
                        passHref
                        legacyBehavior
                        data-oid="t1.55ia"
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
                          data-oid="d1b52mx"
                        >
                          <a
                            className="rounded-[16px] w-full flex items-center justify-center group-data-[state=expanded]:justify-start group-data-[state=collapsed]:p-2 group-data-[state=collapsed]:mx-auto"
                            data-oid="a-4x5_p"
                          >
                            <item.icon data-oid="inwjj97" />
                            <span
                              className="group-data-[state=expanded]:inline hidden"
                              data-oid="xf65omo"
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
              <SidebarGroup
                className="py-6 mb-0 group w-full group-data-[state=collapsed]:px-0.5 group-data-[state=expanded]:px-4"
                data-oid="3loqim3"
              >
                <SidebarGroupLabel
                  className="px-2 text-xs uppercase tracking-wider mb-2 text-muted-foreground group-data-[state=expanded]:block hidden"
                  data-oid="wh5f:ew"
                >
                  Users
                </SidebarGroupLabel>
                {/* Hidden spacer for collapsed state */}
                <div
                  className="h-8 group-data-[state=expanded]:hidden"
                  data-oid="df7j.l:"
                />

                <SidebarMenu
                  className="w-full group-data-[state=collapsed]:max-w-[54px] group-data-[state=collapsed]:!p-1.5 group-data-[state=collapsed]:flex group-data-[state=collapsed]:items-center group-data-[state=collapsed]:justify-center"
                  data-oid="09gp8tq"
                >
                  {navItems.users.map((item) => (
                    <SidebarMenuItem key={item.href} data-oid=":2j_vkm">
                      <Link
                        href={item.href}
                        passHref
                        legacyBehavior
                        data-oid="0y-yisp"
                      >
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.startsWith(item.href)}
                          tooltip={item.label}
                          variant="default"
                          className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                          data-oid="5r29nfx"
                        >
                          <a data-oid="1d59.-h">
                            <item.icon data-oid="2_xwmwq" />
                            <span
                              className="group-data-[state=expanded]:inline hidden"
                              data-oid="8v1lvz5"
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
              <SidebarGroup
                className="py-6 mb-0 group w-full group-data-[state=collapsed]:px-0.5 group-data-[state=expanded]:px-4"
                data-oid="zu.16h-"
              >
                <SidebarGroupLabel
                  className="px-2 text-xs uppercase tracking-wider mb-2 text-muted-foreground group-data-[state=expanded]:block hidden"
                  data-oid="tufgsbe"
                >
                  Finance
                </SidebarGroupLabel>
                {/* Hidden spacer for collapsed state */}
                <div
                  className="h-8 group-data-[state=expanded]:hidden"
                  data-oid="6p2r9t6"
                />

                <SidebarMenu
                  className="w-full group-data-[state=collapsed]:max-w-[54px] group-data-[state=collapsed]:!p-1.5 group-data-[state=collapsed]:flex group-data-[state=collapsed]:items-center group-data-[state=collapsed]:justify-center"
                  data-oid="z-1-nge"
                >
                  {navItems.finance.map((item) => (
                    <SidebarMenuItem key={item.href} data-oid="xm2qb_k">
                      <Link
                        href={item.href}
                        passHref
                        legacyBehavior
                        data-oid="0nuv61c"
                      >
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.startsWith(item.href)}
                          tooltip={item.label}
                          variant="default"
                          className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                          data-oid="mr9.yb:"
                        >
                          <a data-oid="iwn7-wr">
                            <item.icon data-oid="3-jdp2y" />
                            <span
                              className="group-data-[state=expanded]:inline hidden"
                              data-oid=":1jdl55"
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
              <SidebarGroup
                className="py-6 mb-0 group w-full group-data-[state=collapsed]:px-0.5 group-data-[state=expanded]:px-4"
                data-oid="47thd3q"
              >
                <SidebarGroupLabel
                  className="px-2 text-xs uppercase tracking-wider mb-2 text-muted-foreground group-data-[state=expanded]:block hidden"
                  data-oid=":o9vm57"
                >
                  Settings
                </SidebarGroupLabel>
                {/* Hidden spacer for collapsed state */}
                <div
                  className="h-8 group-data-[state=expanded]:hidden"
                  data-oid="t.6m6fv"
                />

                <SidebarMenu
                  className="w-full group-data-[state=collapsed]:max-w-[54px] group-data-[state=collapsed]:!p-1.5 group-data-[state=collapsed]:flex group-data-[state=collapsed]:items-center group-data-[state=collapsed]:justify-center"
                  data-oid="t:wks.i"
                >
                  {/* Пункт меню Settings */}
                  {navItems.settings.map((item) => (
                    <SidebarMenuItem key={item.href} data-oid="9dtbp9y">
                      <Link
                        href={item.href}
                        passHref
                        legacyBehavior
                        data-oid="hv60nac"
                      >
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.startsWith(item.href)}
                          tooltip={item.label}
                          variant="default"
                          className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                          data-oid="bqbwo3d"
                        >
                          <a data-oid="hrrfde7">
                            <item.icon data-oid="_6mnp:i" />
                            <span
                              className="group-data-[state=expanded]:inline hidden"
                              data-oid="25ave2j"
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
                      <SidebarMenuItem data-oid="1hhyyk9">
                        <div
                          onClick={() => {
                            const isExpanded =
                              localStorage.getItem("optionsSetExpanded") ===
                              "true";
                            localStorage.setItem(
                              "optionsSetExpanded",
                              (!isExpanded).toString(),
                            );
                            setIsOptionsSetExpanded(!isExpanded);
                            
                            // Вызываем принудительную прокрутку
                            scrollToOptionsButton();
                          }}
                          className="flex w-full items-center justify-between gap-2 overflow-hidden rounded-2xl p-2 text-left cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-10 text-sm text-sidebar-foreground"
                          data-oid="l-j964n"
                        >
                          <div
                            className="flex items-center gap-2"
                            data-oid="6i5l_63"
                          >
                            <Settings className="h-4 w-4" data-oid="3ukkbo." />
                            <span
                              className="group-data-[state=expanded]:inline hidden"
                              data-oid="lmnc:zj"
                            >
                              Набор опций
                            </span>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 ${menuAnimationStyles.chevron} ${isOptionsSetExpanded ? menuAnimationStyles.chevronOpen : ""}`}
                            data-oid="s98lti3"
                          />
                        </div>
                      </SidebarMenuItem>

                      {/* Пункты меню внутри раскрывающегося списка */}
                      <div
                        className={`${menuAnimationStyles.menuGroup} ${isOptionsSetExpanded ? "max-h-[500px]" : "max-h-0"}`}
                        data-oid="q8f8nav"
                        ref={optionsSetRef}
                      >
                        {navItems.optionsSet.map((item) => (
                          <SidebarMenuItem
                            key={item.href}
                            className={`${menuAnimationStyles.menuItem} ${isOptionsSetExpanded ? menuAnimationStyles.menuItemOpen : menuAnimationStyles.menuItemClosed}`}
                            data-oid="dckr6:l"
                          >
                            <Link
                              href={item.href}
                              passHref
                              legacyBehavior
                              data-oid="tfp6svr"
                            >
                              <SidebarMenuButton
                                asChild
                                isActive={pathname.startsWith(item.href)}
                                tooltip={item.label}
                                variant="default"
                                className="text-sidebar-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground pl-6"
                                data-oid="3r-n64j"
                              >
                                <a data-oid="e49rrdk">
                                  <item.icon data-oid="wnk8t-q" />

                                  <span
                                    className="group-data-[state=expanded]:inline hidden"
                                    data-oid="9lulbff"
                                  >
                                    {item.label}
                                  </span>
                                </a>
                              </SidebarMenuButton>
                            </Link>
                          </SidebarMenuItem>
                        ))}
                      </div>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroup>
            )}
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter
          className="p-4 border-t border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground group-data-[state=expanded]:flex hidden items-center justify-between gap-2"
          data-oid="280ccmg"
        >
          <div
            className="flex items-center justify-between w-full gap-2"
            data-oid="j5g6d5e"
          >
            <div
              className="flex items-center gap-2 flex-grow min-w-0"
              data-oid="0ib5ncu"
            >
              <Avatar className="h-10 w-10 shrink-0" data-oid="0t:r30v">
                <AvatarFallback
                  className="bg-white/20 text-sidebar-primary-foreground"
                  data-oid="4zhz-rn"
                >
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow min-w-0" data-oid="xco4t:j">
                <p
                  className="text-base font-medium text-white truncate"
                  data-oid="-93reju"
                >
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
              data-oid="3c.:pco"
            >
              <LogOut className="h-5 w-5" data-oid="exzybul" />
            </Button>
          </div>
        </SidebarFooter>
        <SidebarFooter
          className="p-4 border-t border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground group-data-[state=collapsed]:flex hidden justify-center"
          data-oid="08ynet_"
        >
          <Avatar className="h-10 w-10" data-oid="t2g9cl8">
            <AvatarFallback
              className="bg-white/20 text-sidebar-primary-foreground"
              data-oid=".85_w.g"
            >
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </SidebarFooter>
        {/* Удаляем старую кнопку из этого места */}
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen" data-oid=":6lf746">
        {/* Pass user info to Header */}
        <Header
          userEmail={authUser.email}
          userRole={authUser.role}
          data-oid="up4cwbw"
        />

        {/* Левый угловой элемент */}
        <div 
          className={cn(
            "fixed z-30 top-[70px] w-4 h-4 bg-white transition-all duration-300",
            "group-data-[state=expanded]/sidebar-wrapper:left-64 group-data-[state=collapsed]/sidebar-wrapper:left-[70px]",
          )}
        >
          <div className="absolute inset-0 bg-background rounded-tl-2xl" />
        </div>

        {/* Правый угловой элемент */}
        <div 
          className={cn(
            "fixed z-30 top-[70px] w-4 h-4 bg-white transition-all duration-300",
            isCommPanelExpanded ? "right-80" : "right-[70px]", // Исправлено на right-80 (20rem) для соответствия ширине панели
          )}
        >
          <div className="absolute inset-0 bg-background rounded-tr-2xl" />
        </div>

        {/* Основной контейнер с контентом */}
        <SidebarInset
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 bg-background",
            "p-8 md:p-8",
            // Left margin based on left sidebar state
            "group-data-[state=expanded]/sidebar-wrapper:ml-64 group-data-[state=collapsed]/sidebar-wrapper:ml-[70px]",
            // Right margin based on communication panel state
            rightMarginClass,
          )}
          data-oid="j7ls_7y"
        >
          {children}
        </SidebarInset>
      </div>

      {/* Communication Panel */}
      <CommunicationPanel
        isExpanded={isCommPanelExpanded}
        setIsExpanded={setIsCommPanelExpanded}
        data-oid="d2ma4yp"
      />
    </SidebarProvider>
  );
}
