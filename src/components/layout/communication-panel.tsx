
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Activity as ActivityIcon, Search, UserPlus as UserPlusIcon, DollarSign as DollarSignIcon, CheckCircle as CheckCircleIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Define icons before usage
const CheckCircle = CheckCircleIcon; // Use Lucide icon
const UserPlus = UserPlusIcon; // Use Lucide icon
const DollarSign = DollarSignIcon; // Use Lucide icon

export function CommunicationPanel() {
  const [isCommunicationExpanded, setIsCommunicationExpanded] = React.useState(false); // Default to collapsed

  // Mock data - replace with actual data fetching
  const notifications = [
    { id: 1, title: "New Bid Received", description: "John Doe placed a bid on 'Website Redesign'.", time: "5m ago" },
    { id: 2, title: "Task Approved", description: "Your task 'Logo Design - Iteration 1' was approved.", time: "1h ago" },
    { id: 3, title: "Payment Received", description: "Received payment for Project 'Content Writing'.", time: "1d ago" },
  ];

  const messages = [
     { id: 1, sender: "Alex Chen", initials: "AC", preview: "Hi John, I've reviewed the project timeline and have some questions...", time: "10:42 AM", unread: true, active: false, avatarBg: "bg-sidebar-accent", avatarText: "text-primary" },
     { id: 2, sender: "Sarah Johnson", initials: "SJ", preview: "The new designs are ready for review. Let me know what you think!", time: "9:15 AM", unread: true, active: true, avatarBg: "bg-emerald-100", avatarText: "text-emerald-800" },
     { id: 3, sender: "TechStart Team", initials: "TS", preview: "We need to schedule a call to discuss the next phase of the project...", time: "Yesterday", unread: false, active: false, avatarBg: "bg-blue-100", avatarText: "text-blue-800" },
     { id: 4, sender: "Michael Park", initials: "MP", preview: "Thanks for the update. I'll review the documents and get back to you...", time: "Yesterday", unread: false, active: false, avatarBg: "bg-amber-100", avatarText: "text-amber-800" },
     { id: 5, sender: "GreenLife", initials: "GL", preview: "We're very happy with the initial concepts. When can we expect...", time: "Monday", unread: false, active: false, avatarBg: "bg-purple-100", avatarText: "text-purple-800" },
  ];

  const activities = [ // Mock activities
     { id: 1, user: "Website Redesign", action: "project has been completed", time: "2 hours ago", icon: CheckCircle, iconColor: "text-emerald-500", bgColor: "bg-emerald-100"}, // Use defined CheckCircle
     { id: 2, user: "Sarah Johnson", action: "joined the team as a UI Designer", time: "5 hours ago", icon: UserPlus, iconColor: "text-blue-500", bgColor: "bg-blue-100"}, // Use defined UserPlus
     { id: 3, user: "Mobile App", action: "project deadline has been extended", time: "Yesterday", icon: Bell, iconColor: "text-amber-500", bgColor: "bg-amber-100"}, // Bell is imported from lucide-react directly
     { id: 4, user: "$12,500", action: "payment received from TechStart", time: "2 days ago", icon: DollarSign, iconColor: "text-primary", bgColor: "bg-sidebar-accent"}, // Use defined DollarSign
  ];


  return (
    <aside className={`fixed right-0 top-0 bottom-0 ${isCommunicationExpanded ? 'w-80' : 'w-[70px]'} bg-card border-l border-border z-20 flex flex-col transition-all duration-300`}>
       {/* Header */}
        <div className="h-[70px] border-b border-border flex items-center px-6 justify-between">
          {isCommunicationExpanded && <h3 className="text-lg font-light text-foreground">Communications</h3>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCommunicationExpanded(!isCommunicationExpanded)}
            className="text-muted-foreground hover:text-primary cursor-pointer h-auto w-auto p-1"
          >
            {isCommunicationExpanded ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

       {/* Content Area */}
       {isCommunicationExpanded ? (
          <Tabs defaultValue="messages" className="flex flex-col flex-1">
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
                        <div key={message.id} className={`border-b border-border p-4 hover:bg-accent cursor-pointer ${message.active ? 'bg-sidebar-accent' : ''}`}>
                        <div className="flex items-start">
                            <Avatar className="w-10 h-10 mr-3 flex-shrink-0">
                                 <AvatarFallback className={`text-sm ${message.avatarBg} ${message.avatarText}`}>{message.initials}</AvatarFallback>
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
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.bgColor} ${activity.iconColor} flex items-center justify-center z-10 mr-4`}>
                                    <activity.icon className="h-4 w-4"/>
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
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-sidebar-accent text-primary">
                    <MessageSquare className="h-5 w-5" />
                </Button>
                 <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-primary">
                     <Bell className="h-5 w-5" />
                 </Button>
                 <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-primary">
                    <ActivityIcon className="h-5 w-5" />
                 </Button>
            </div>
       )}
    </aside>
  );
}
