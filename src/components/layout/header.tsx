
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
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter and usePathname
import { useToast } from "@/hooks/use-toast"; // Import useToast
import type { UserRole } from "@/lib/types"; // Use type import

// Map routes to titles (can be expanded)
const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/settings': 'Settings',
  '/projects': 'Projects',
  '/orders': 'Orders',
  '/finance': 'Finance',
  '/find-orders': 'Find Orders',
  '/my-bids': 'My Bids',
  '/my-tasks': 'My Tasks',
  '/users': 'Manage Users',
  '/finance-admin': 'Platform Finance',
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
    localStorage.removeItem('authUser');
    // Show toast message
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // Redirect to auth page
    router.push('/auth');
  };

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : '?';
  const pageTitle = routeTitles[pathname] || 'TaskVerse'; // Default title

  return (
    <header className="sticky top-0 z-30 flex h-[70px] items-center gap-4 border-b border-border bg-card px-8"> {/* Adjusted height, bg, border, padding */}
       {/* Mobile Sidebar Trigger is now part of the Sidebar component */}

      {/* Page Title */}
      <div className="flex-1">
        <h1 className="text-xl font-light text-foreground">{pageTitle}</h1> {/* Adjusted font weight */}
      </div>

      {/* Search Bar */}
      <div className="relative ml-auto hidden md:block"> {/* Hide on mobile */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> {/* Adjusted icon size and position */}
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-md bg-muted border-border py-2 pl-10 pr-4 text-sm focus:ring-primary focus:border-primary lg:w-[300px]" /* Adjusted styles */
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4"> {/* Adjusted gap */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <Bell className="h-6 w-6" />
          <span className="sr-only">Toggle notifications</span>
        </Button>

        {/* Removed Calendar and explicit Search button from header */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full shrink-0">
               <Avatar className="h-8 w-8">
                 {/* Use placeholder image or fallback */}
                 {/* <AvatarImage src="/placeholder-user.jpg" alt={userEmail} /> */}
                 <AvatarFallback>{userInitial}</AvatarFallback>
               </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{userRole}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
