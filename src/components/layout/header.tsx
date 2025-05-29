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
      className="sticky top-0 z-30 flex bg-card p-0 px-[32px] py-0 gap-4 flex-row items-center h-[70px]"
      data-oid="90qa4c."
    >
      {" "}
      {/* Adjusted height, bg, border, padding */}
      {/* Mobile Sidebar Trigger is now part of the Sidebar component */}
      {/* Page Title */}
      {/* Search Bar */}
      {/* User Actions */}
      <div className="flex-1" data-oid="hfo0b68">
        <h1 className="text-xl font-light text-foreground" data-oid="sjypn:a">
          {pageTitle}
        </h1>{" "}
        {/* Adjusted font weight */}
      </div>
      <div className="relative ml-auto hidden md:block" data-oid="x2.5aeo">
        {" "}
        {/* Hide on mobile */}
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
          data-oid="e8vyl:r"
        />{" "}
        {/* Adjusted icon size and position */}
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-md bg-muted border-border py-2 pl-10 pr-4 text-sm focus:ring-primary focus:border-primary lg:w-[300px]"
          /* Adjusted styles */ data-oid="bcixne7"
        />
      </div>
      <div className="flex items-center gap-4" data-oid="3_-q19s">
        {" "}
        {/* Adjusted gap */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          data-oid="c_bb8bn"
        >
          <Bell className="h-6 w-6" data-oid="jg_3zz." />
          <span className="sr-only" data-oid="kjzjgsr">
            Toggle notifications
          </span>
        </Button>
        {/* Removed Calendar and explicit Search button from header */}
        <DropdownMenu data-oid="x52e4uy">
          <DropdownMenuTrigger asChild data-oid="8tt4:c5">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full shrink-0"
              data-oid="_jfnu0a"
            >
              <Avatar className="h-8 w-8" data-oid="0k1g7nd">
                {/* Use placeholder image or fallback */}
                {/* <AvatarImage src="/placeholder-user.jpg" alt={userEmail} /> */}
                <AvatarFallback data-oid="sq4le.o">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" data-oid="y5iipoc">
            <DropdownMenuLabel data-oid="f2d-4xq">{userRole}</DropdownMenuLabel>
            <DropdownMenuSeparator data-oid=".tx-gff" />
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              data-oid="wmfej:w"
            >
              <Settings className="mr-2 h-4 w-4" data-oid=".9jxwx6" />
              <span data-oid=":a7z:2p">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator data-oid="l8x6ptc" />
            <DropdownMenuItem onClick={handleLogout} data-oid="haqw7w_">
              <LogOut className="mr-2 h-4 w-4" data-oid="ow9wmt5" />
              <span data-oid="rvti6yv">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
