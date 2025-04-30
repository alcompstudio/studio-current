"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  // Mock user data - replace with actual auth context
  const userName = "User Name";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
       {/* Mobile Sidebar Trigger */}
       <div className="md:hidden">
         <SidebarTrigger asChild>
           <Button size="icon" variant="outline">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left-open"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
           </Button>
         </SidebarTrigger>
       </div>


      {/* Placeholder for Breadcrumbs or Page Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold hidden md:block">Dashboard</h1>
      </div>

      {/* Search Bar */}
      <div className="relative flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
           {/* Optional: Add a badge for unread notifications */}
           {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" /> */}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
               <Avatar className="h-8 w-8">
                 <AvatarImage src="/placeholder-user.jpg" alt={userName} />
                 <AvatarFallback>{userInitial}</AvatarFallback>
               </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            {/* Add more user-specific actions here */}
            <DropdownMenuSeparator />
            <DropdownMenuItem >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
               {/* TODO: Add logout functionality */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
