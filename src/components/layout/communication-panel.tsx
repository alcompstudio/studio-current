"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function CommunicationPanel() {
  // Mock data - replace with actual data fetching
  const notifications = [
    { id: 1, title: "New Bid Received", description: "John Doe placed a bid on 'Website Redesign'.", time: "5m ago" },
    { id: 2, title: "Task Approved", description: "Your task 'Logo Design - Iteration 1' was approved.", time: "1h ago" },
    { id: 3, title: "Payment Received", description: "Received payment for Project 'Content Writing'.", time: "1d ago" },
  ];

  const messages = [
     { id: 1, sender: "Jane Smith", preview: "Regarding the project timeline...", time: "10m ago", unread: true },
     { id: 2, sender: "Project Alpha", preview: "Can you check the latest file?", time: "2h ago", unread: false },
     { id: 3, sender: "Admin Support", preview: "Your profile update is complete.", time: "3d ago", unread: false },
  ];


  return (
    <div className="fixed right-0 top-0 bottom-0 z-20 hidden h-screen w-72 border-l bg-background md:block">
      <Tabs defaultValue="notifications" className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
          <TabsTrigger value="notifications" className="gap-1">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-1">
             <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1">
          <TabsContent value="notifications" className="mt-0 p-4 space-y-4">
             <h3 className="text-lg font-semibold">Recent Notifications</h3>
             {notifications.length > 0 ? (
               notifications.map((notification, index) => (
                 <React.Fragment key={notification.id}>
                   <div className="p-2 rounded-md hover:bg-accent cursor-pointer">
                     <p className="text-sm font-medium">{notification.title}</p>
                     <p className="text-xs text-muted-foreground">{notification.description}</p>
                     <p className="text-xs text-muted-foreground text-right">{notification.time}</p>
                   </div>
                   {index < notifications.length - 1 && <Separator />}
                 </React.Fragment>
               ))
             ) : (
               <p className="text-sm text-muted-foreground text-center py-8">No new notifications.</p>
             )}
          </TabsContent>
          <TabsContent value="messages" className="mt-0 p-4 space-y-4">
            <h3 className="text-lg font-semibold">Recent Messages</h3>
             {messages.length > 0 ? (
               messages.map((message, index) => (
                  <React.Fragment key={message.id}>
                    <div className={`p-2 rounded-md hover:bg-accent cursor-pointer ${message.unread ? 'font-medium' : ''}`}>
                      <div className="flex justify-between items-center">
                         <p className="text-sm">{message.sender}</p>
                         <p className="text-xs text-muted-foreground">{message.time}</p>
                      </div>
                      <p className={`text-xs truncate ${message.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{message.preview}</p>
                    </div>
                   {index < messages.length - 1 && <Separator />}
                 </React.Fragment>
               ))
             ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No new messages.</p>
             )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
