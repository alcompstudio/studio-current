"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  MessageSquare,
  Activity as ActivityIcon,
  Search,
  UserPlus,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react"; // Import ChevronRight and CheckCircle
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CommunicationPanelProps {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

export function CommunicationPanel({
  isExpanded,
  setIsExpanded,
}: CommunicationPanelProps) {
  // Mock data - replace with actual data fetching
  const notifications = [
    {
      id: 1,
      title: "New Bid Received",
      description: "John Doe placed a bid on 'Website Redesign'.",
      time: "5m ago",
    },
    {
      id: 2,
      title: "Task Approved",
      description: "Your task 'Logo Design - Iteration 1' was approved.",
      time: "1h ago",
    },
    {
      id: 3,
      title: "Payment Received",
      description: "Received payment for Project 'Content Writing'.",
      time: "1d ago",
    },
    {
      id: 4,
      title: "New Message",
      description: "Sarah Johnson sent you a message regarding 'Mobile App'.",
      time: "2d ago",
    },
    {
      id: 5,
      title: "Project Update",
      description: "Client Acme Inc. requested changes on 'Website Redesign'.",
      time: "2d ago",
    },
    {
      id: 6,
      title: "Invoice Paid",
      description: "Invoice #INV-0123 for TechStart has been paid.",
      time: "3d ago",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Alex Chen",
      initials: "AC",
      preview:
        "Hi John, I've reviewed the project timeline and have some questions...",
      time: "10:42 AM",
      unread: true,
      active: false,
      avatarBg: "bg-sidebar-accent",
      avatarText: "text-primary",
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      initials: "SJ",
      preview:
        "The new designs are ready for review. Let me know what you think!",
      time: "9:15 AM",
      unread: true,
      active: true,
      avatarBg: "bg-emerald-100",
      avatarText: "text-emerald-800",
    },
    {
      id: 3,
      sender: "TechStart Team",
      initials: "TS",
      preview:
        "We need to schedule a call to discuss the next phase of the project...",
      time: "Yesterday",
      unread: false,
      active: false,
      avatarBg: "bg-blue-100",
      avatarText: "text-blue-800",
    },
    {
      id: 4,
      sender: "Michael Park",
      initials: "MP",
      preview:
        "Thanks for the update. I'll review the documents and get back to you...",
      time: "Yesterday",
      unread: false,
      active: false,
      avatarBg: "bg-amber-100",
      avatarText: "text-amber-800",
    },
    {
      id: 5,
      sender: "GreenLife",
      initials: "GL",
      preview:
        "We're very happy with the initial concepts. When can we expect...",
      time: "Monday",
      unread: false,
      active: false,
      avatarBg: "bg-purple-100",
      avatarText: "text-purple-800",
    },
    {
      id: 6,
      sender: "Support Team",
      initials: "ST",
      preview: "Your support ticket #12345 has been updated.",
      time: "Monday",
      unread: false,
      active: false,
      avatarBg: "bg-muted",
      avatarText: "text-muted-foreground",
    },
    {
      id: 7,
      sender: "Jane Doe",
      initials: "JD",
      preview: "Can we discuss the budget for the new marketing campaign?",
      time: "Tuesday",
      unread: false,
      active: false,
      avatarBg: "bg-red-100",
      avatarText: "text-red-800",
    },
    {
      id: 8,
      sender: "Marketing Dept",
      initials: "MD",
      preview: "Reminder: Monthly marketing meeting tomorrow at 10 AM.",
      time: "Tuesday",
      unread: false,
      active: false,
      avatarBg: "bg-indigo-100",
      avatarText: "text-indigo-800",
    },
  ];

  const activities = [
    // Mock activities
    {
      id: 1,
      user: "Website Redesign",
      action: "project has been completed",
      time: "2 hours ago",
      icon: CheckCircle,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-500",
    }, // Use CheckCircle directly
    {
      id: 2,
      user: "Sarah Johnson",
      action: "joined the team as a UI Designer",
      time: "5 hours ago",
      icon: UserPlus,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      id: 3,
      user: "Mobile App",
      action: "project deadline has been extended",
      time: "Yesterday",
      icon: Bell,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-500",
    },
    {
      id: 4,
      user: "$12,500",
      action: "payment received from TechStart",
      time: "2 days ago",
      icon: DollarSign,
      bgColor: "bg-sidebar-accent",
      iconColor: "text-primary",
    },
    {
      id: 5,
      user: "Acme Inc.",
      action: "posted a new Order: 'Logo Update'",
      time: "3 days ago",
      icon: UserPlus,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-500",
    }, // Example additional activity
  ];

  const handleIconClick = () => {
    setIsExpanded(true); // Always expand when an icon is clicked
  };

  return (
    // Adjusted positioning: top-[70px] to place below header, height calc
    <aside
      className={`fixed right-0 top-[70px] bottom-0 ${isExpanded ? "w-80" : "w-[70px]"} bg-card border-border z-20 flex flex-col transition-all duration-300 h-[calc(100vh-70px)]`}
      data-oid="1o50pvd"
    >
      {/* Content Area */}
      {isExpanded ? (
        <Tabs
          defaultValue="messages"
          className="flex flex-col flex-1 overflow-hidden"
          data-oid="hn06si0"
        >
          {" "}
          {/* Ensure Tabs fills height and hides overflow */}
          {/* Toggle Button moved to top right, inside the panel */}
          <div
            className="h-[60px] border-b border-border flex items-center px-6 justify-between flex-shrink-0"
            data-oid="6fgio3a"
          >
            {" "}
            {/* Prevent shrinking */}
            <h3
              className="text-lg font-light text-foreground"
              data-oid="-mve_.s"
            >
              Communications
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)} // Toggle state
              className="text-muted-foreground hover:text-primary cursor-pointer h-auto w-auto p-1"
              data-oid="_s:x93f"
            >
              {/* Show ChevronRight (to collapse) when expanded */}
              <ChevronRight className="h-5 w-5" data-oid="z0ni8ch" />
            </Button>
          </div>
          {/* Tabs */}
          <TabsList
            className="grid w-full grid-cols-3 rounded-none border-b bg-card p-0 flex-shrink-0"
            data-oid="3v2fi4g"
          >
            {" "}
            {/* Prevent shrinking */}
            <TabsTrigger
              value="messages"
              className="flex-1 py-3 text-sm font-light rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card hover:text-primary"
              data-oid="4c0wq-s"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex-1 py-3 text-sm font-light rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card hover:text-primary"
              data-oid="co7wcsd"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="flex-1 py-3 text-sm font-light rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card hover:text-primary"
              data-oid="y7igekn"
            >
              Activity
            </TabsTrigger>
          </TabsList>
          {/* Search */}
          <div
            className="p-4 border-b border-border flex-shrink-0"
            data-oid="bd8gs:r"
          >
            {" "}
            {/* Prevent shrinking */}
            <div className="relative" data-oid="lb-mc0-">
              <Input
                type="text"
                placeholder="Search messages..."
                className="w-full bg-muted border-border rounded-md py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                data-oid="y3d6.4p"
              />

              <Search
                className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
                data-oid="5rgk:su"
              />
            </div>
          </div>
          {/* Tab Content wrapped in ScrollArea */}
          <ScrollArea className="flex-1" data-oid="3.hibl4">
            {" "}
            {/* Allow ScrollArea to take remaining space */}
            <TabsContent value="messages" className="mt-0" data-oid="mbzfrxn">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`border-b border-border p-4 hover:bg-accent cursor-pointer ${message.active ? "bg-sidebar-accent" : ""}`}
                    data-oid="cz94e0u"
                  >
                    <div className="flex items-start" data-oid="s-yqmsr">
                      <Avatar
                        className="w-10 h-10 mr-3 flex-shrink-0"
                        data-oid="b9sk-tt"
                      >
                        <AvatarFallback
                          className={`text-sm ${message.avatarBg} ${message.avatarText}`}
                          data-oid="mjg6055"
                        >
                          {message.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0" data-oid="9h1qwl3">
                        <div
                          className="flex justify-between items-center mb-1"
                          data-oid="_c9oxlf"
                        >
                          <h4
                            className={`text-sm truncate ${message.unread ? "font-medium text-foreground" : "font-light text-foreground"}`}
                            data-oid="3h7_2qs"
                          >
                            {message.sender}
                          </h4>
                          <span
                            className="text-xs text-muted-foreground"
                            data-oid="r2wboga"
                          >
                            {message.time}
                          </span>
                        </div>
                        <p
                          className={`text-sm truncate ${message.unread ? "text-foreground" : "text-muted-foreground"}`}
                          data-oid="ta8-4.2"
                        >
                          {message.preview}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  className="text-sm text-muted-foreground text-center py-8"
                  data-oid=".cmgdbm"
                >
                  No new messages.
                </p>
              )}
            </TabsContent>
            <TabsContent
              value="notifications"
              className="mt-0 p-4 space-y-4"
              data-oid="kkqd-zb"
            >
              {/* <h3 className="text-lg font-semibold">Recent Notifications</h3> */}
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <div
                      className="p-2 rounded-md hover:bg-accent cursor-pointer"
                      data-oid="hgavb6v"
                    >
                      <p className="text-sm font-medium" data-oid=".1eq8vq">
                        {notification.title}
                      </p>
                      <p
                        className="text-xs text-muted-foreground"
                        data-oid="b5i30f2"
                      >
                        {notification.description}
                      </p>
                      <p
                        className="text-xs text-muted-foreground text-right"
                        data-oid="huy3gcw"
                      >
                        {notification.time}
                      </p>
                    </div>
                    {index < notifications.length - 1 && (
                      <Separator data-oid="29z0h89" />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <p
                  className="text-sm text-muted-foreground text-center py-8"
                  data-oid="erelpel"
                >
                  No new notifications.
                </p>
              )}
            </TabsContent>
            <TabsContent
              value="activity"
              className="mt-0 p-6"
              data-oid="p1q-9zv"
            >
              <div className="relative" data-oid="vou-ixj">
                <div
                  className="absolute top-0 bottom-0 left-4 w-px bg-border"
                  data-oid="w3ohx8z"
                ></div>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="relative flex items-start mb-6"
                    data-oid="b:cvk9w"
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.bgColor || "bg-muted"} ${activity.iconColor || "text-muted-foreground"} flex items-center justify-center z-10 mr-4`}
                      data-oid="toqr64-"
                    >
                      <activity.icon className="h-4 w-4" data-oid="2gwv:9w" />
                    </div>
                    <div data-oid="1vn4ku-">
                      <p
                        className="text-sm font-light text-foreground"
                        data-oid="5lmmx:_"
                      >
                        <span className="font-medium" data-oid="-f588xe">
                          {activity.user}
                        </span>{" "}
                        {activity.action}
                      </p>
                      <p
                        className="text-xs text-muted-foreground mt-1"
                        data-oid="tap_pul"
                      >
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      ) : (
        // Collapsed view - show icons and expand button
        <div
          className="flex-1 flex flex-col items-center pt-4 space-y-6 border-none shadow-none"
          data-oid="etkan-w"
        >
          {/* Expand Button at the top */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)} // Expand on click
            className="text-muted-foreground hover:text-primary cursor-pointer h-auto w-auto p-1 mb-4" // Added margin bottom
            data-oid="ya2p:m3"
          >
            <ChevronLeft className="h-5 w-5" data-oid="fyhcx7t" />
          </Button>

          {/* Tab Icons */}
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-primary"
            onClick={handleIconClick}
            data-oid="ish3uik"
          >
            <MessageSquare className="h-5 w-5" data-oid="-5e_o.l" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-primary"
            onClick={handleIconClick}
            data-oid="_98ehk-"
          >
            <Bell className="h-5 w-5" data-oid=".7j7d4e" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-primary"
            onClick={handleIconClick}
            data-oid="bzf-zec"
          >
            <ActivityIcon className="h-5 w-5" data-oid="zp:kjex" />
          </Button>
        </div>
      )}
    </aside>
  );
}
