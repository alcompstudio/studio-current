"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Settings, LogOut } from "lucide-react"; // Removed PanelLeftOpen
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter and usePathname
import { useToast } from "@/hooks/use-toast"; // Import useToast
import type { UserRole } from "@/lib/types"; // Use type import

// Map routes to titles (can be expanded)
const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/settings": "Settings",
  "/projects": "Projects",
  "/orders": "Orders",
  "/finance": "Finance",
  "/find-orders": "Find Orders",
  "/my-bids": "My Bids",
  "/my-tasks": "My Tasks",
  "/users": "Manage Users",
  "/finance-admin": "Platform Finance",
  // Add more mappings as needed
};

// Props type for Header
interface HeaderProps {
  userEmail: string;
  userRole: UserRole;
}

export function Header({ userEmail, userRole }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

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
  };

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";
  const pageTitle = routeTitles[pathname] || "TaskVerse"; // Default title

  return (
    <header
      className="sticky top-0 z-30 flex h-[70px] items-center gap-4 bg-card px-8"
      data-oid="ye294j1"
    >
      {" "}
      {/* Adjusted height, bg, border, padding */}
      {/* Mobile Sidebar Trigger is now part of the Sidebar component */}
      {/* Page Title */}
      <div className="flex-1" data-oid="l3v.w8a">
        <h1 className="text-xl font-light text-foreground" data-oid="4xwq0qp">
          {pageTitle}
        </h1>{" "}
        {/* Adjusted font weight */}
      </div>
      {/* Search Bar */}
      <div className="relative ml-auto hidden md:block" data-oid="wpd0jp0">
        {" "}
        {/* Hide on mobile */}
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
          data-oid="arr67.9"
        />{" "}
        {/* Adjusted icon size and position */}
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-md bg-muted border-border py-2 pl-10 pr-4 text-sm focus:ring-primary focus:border-primary lg:w-[300px]"
          /* Adjusted styles */ data-oid="ct2-.2q"
        />
      </div>
      {/* User Actions */}
      <div className="flex items-center gap-4" data-oid="84:s2ra">
        {" "}
        {/* Adjusted gap */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          data-oid="sqq3:tw"
        >
          <Bell className="h-6 w-6" data-oid="r3l9c34" />
          <span className="sr-only" data-oid="alfrkpj">
            Toggle notifications
          </span>
        </Button>
        {/* Removed Calendar and explicit Search button from header */}
        <DropdownMenu data-oid="b:2yh:1">
          <DropdownMenuTrigger asChild data-oid="gjn28yx">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full shrink-0"
              data-oid="15ppf5h"
            >
              <Avatar className="h-8 w-8" data-oid="4n6hig6">
                {/* Use placeholder image or fallback */}
                {/* <AvatarImage src="/placeholder-user.jpg" alt={userEmail} /> */}
                <AvatarFallback data-oid="wzkuya-">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" data-oid="7aa7uld">
            <DropdownMenuLabel data-oid="i8vi.ax">{userRole}</DropdownMenuLabel>
            <DropdownMenuSeparator data-oid="6nub6fc" />
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              data-oid="-jysl6b"
            >
              <Settings className="mr-2 h-4 w-4" data-oid="oarsb64" />
              <span data-oid="zwg.mbi">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator data-oid="6sb5sbu" />
            <DropdownMenuItem onClick={handleLogout} data-oid="7-z_u.c">
              <LogOut className="mr-2 h-4 w-4" data-oid="vag4nbd" />
              <span data-oid="582ab8y">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
