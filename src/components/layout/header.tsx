
"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Settings, LogOut, PanelLeftOpen } from "lucide-react"; // Updated icon import
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
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:px-6 py-2">
       {/* Mobile Sidebar Trigger */}
       <div className="md:hidden">
         <SidebarTrigger asChild>
           <Button size="icon" variant="outline">
             <PanelLeftOpen /> {/* Updated Icon */}
           </Button>
         </SidebarTrigger>
       </div>

      {/* Page Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold hidden md:block">{pageTitle}</h1>
      </div>

      {/* Search Bar */}
      <div className="relative ml-auto flex-1 md:grow-0"> {/* Adjusted positioning */}
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]" /* Adjusted width */
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2 md:gap-4"> {/* Reduced gap slightly */}
        <Button variant="ghost" size="icon" className="rounded-full shrink-0"> {/* Added shrink-0 */}
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
           {/* Optional: Add a badge for unread notifications */}
           {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" /> */}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full shrink-0"> {/* Added shrink-0 */}
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
            <DropdownMenuItem onClick={() => router.push('/settings')}> {/* Navigate to settings */}
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            {/* Add more user-specific actions here */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}> {/* Add logout functionality */}
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
