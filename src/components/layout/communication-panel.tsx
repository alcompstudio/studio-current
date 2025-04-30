"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Activity, Search } from "lucide-react"; // Added Activity, Search
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input"; // Added Input
import { Button } from "@/components/ui/button"; // Added Button
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Added Avatar

export function CommunicationPanel() {
  const [isCommunicationExpanded, setIsCommunicationExpanded] = React.useState(true); // Default to expanded as per example

  // Mock data - replace with actual data fetching
  const notifications = [
    { id: 1, title: "New Bid Received", description: "John Doe placed a bid on 'Website Redesign'.", time: "5m ago" },
    { id: 2, title: "Task Approved", description: "Your task 'Logo Design - Iteration 1' was approved.", time: "1h ago" },
    { id: 3, title: "Payment Received", description: "Received payment for Project 'Content Writing'.", time: "1d ago" },
  ];

  const messages = [
     { id: 1, sender: "Alex Chen", initials: "AC", preview: "Hi John, I've reviewed the project timeline and have some questions...", time: "10:42 AM", unread: true, active: false },
     { id: 2, sender: "Sarah Johnson", initials: "SJ", preview: "The new designs are ready for review. Let me know what you think!", time: "9:15 AM", unread: true, active: true }, // Example active state
     { id: 3, sender: "TechStart Team", initials: "TS", preview: "We need to schedule a call to discuss the next phase of the project...", time: "Yesterday", unread: false, active: false },
     { id: 4, sender: "Michael Park", initials: "MP", preview: "Thanks for the update. I'll review the documents and get back to you...", time: "Yesterday", unread: false, active: false },
     { id: 5, sender: "GreenLife", initials: "GL", preview: "We're very happy with the initial concepts. When can we expect...", time: "Monday", unread: false, active: false },
  ];

  const activities = [ // Mock activities
     { id: 1, user: "Website Redesign", action: "project has been completed", time: "2 hours ago", icon: CheckCircle }, // Replace CheckCircle with appropriate lucide icon if available, otherwise inline SVG or keep text
     { id: 2, user: "Sarah Johnson", action: "joined the team as a UI Designer", time: "5 hours ago", icon: UserPlus },
     { id: 3, user: "Mobile App", action: "project deadline has been extended", time: "Yesterday", icon: Bell },
     { id: 4, user: "$12,500", action: "payment received from TechStart", time: "2 days ago", icon: DollarSign },
  ];

  // Placeholder icons, replace with actual Lucide icons or SVGs
  const CheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  const UserPlus = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
  const DollarSign = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


  return (
    <aside className={`fixed right-0 top-0 bottom-0 ${isCommunicationExpanded ? 'w-80' : 'w-[70px]'} bg-card border-l border-border z-20 flex flex-col transition-all duration-300`}>
       {/* Header */}
        <div className="h-[70px] border-b border-border flex items-center px-6 justify-between">
          {isCommunicationExpanded && <h3 className="text-lg font-light text-foreground">Communications</h3>}
          <button
            onClick={() => setIsCommunicationExpanded(!isCommunicationExpanded)}
            className="text-muted-foreground hover:text-primary cursor-pointer"
          >
            {isCommunicationExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>

       {/* Content Area */}
       {isCommunicationExpanded ? (
          <Tabs defaultValue="messages" className="flex flex-col h-full">
             {/* Tabs */}
             <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-card p-0">
                <TabsTrigger value="messages" className="flex-1 py-3 text-sm font-light rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card hover:text-primary">Messages</TabsTrigger>
                <TabsTrigger value="notifications" className="flex-1 py-3 text-sm font-light rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card hover:text-primary">Notifications</TabsTrigger>
                <TabsTrigger value="activity" className="flex-1 py-3 text-sm font-light rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card hover:text-primary">Activity</TabsTrigger>
             </TabsList>

            {/* Search */}
             <div className="p-4 border-b border-border">
               <div className="relative">
                 <Input
                   type="text"
                   placeholder="Search messages..."
                   className="w-full bg-muted border-border rounded-md py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                 />
                 <Search className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
               </div>
             </div>

            {/* Tab Content */}
             <ScrollArea className="flex-1">
                <TabsContent value="messages" className="mt-0">
                    {messages.length > 0 ? (
                    messages.map((message) => (
                        <div key={message.id} className={`border-b border-border p-4 hover:bg-accent cursor-pointer ${message.active ? 'bg-sidebar-accent' : ''}`}> {/* Adjusted hover and active background */}
                        <div className="flex items-start">
                            <Avatar className="w-10 h-10 mr-3 flex-shrink-0">
                                <AvatarFallback className={`text-sm ${message.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{message.initials}</AvatarFallback> {/* Example dynamic bg based on active */}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className={`text-sm truncate ${message.unread ? 'font-medium text-foreground' : 'font-light text-foreground'}`}>{message.sender}</h4>
                                <span className="text-xs text-muted-foreground">{message.time}</span>
                            </div>
                            <p className={`text-sm truncate ${message.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{message.preview}</p>
                            </div>
                        </div>
                        </div>
                    ))
                    ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No new messages.</p>
                    )}
                </TabsContent>

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

                <TabsContent value="activity" className="mt-0 p-6">
                     <div className="relative">
                        <div className="absolute top-0 bottom-0 left-4 w-px bg-border"></div>
                        {activities.map((activity) => (
                            <div key={activity.id} className="relative flex items-start mb-6">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center z-10 mr-4">
                                    <activity.icon />
                                </div>
                                <div>
                                    <p className="text-sm font-light text-foreground">
                                        <span className="font-medium">{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                 </TabsContent>
             </ScrollArea>
          </Tabs>
       ) : (
           // Collapsed view - just show icons
            <div className="flex-1 flex flex-col items-center pt-4 space-y-6">
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-sidebar-accent text-primary"> {/* Adjusted active button style */}
                    <MessageSquare className="h-5 w-5" />
                </Button>
                 <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-primary">
                     <Bell className="h-5 w-5" />
                 </Button>
                 <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-primary">
                    <Activity className="h-5 w-5" />
                 </Button>
            </div>
       )}
    </aside>
  );
}
