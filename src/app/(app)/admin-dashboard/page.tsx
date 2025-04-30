// src/app/(app)/admin-dashboard/page.tsx
'use client';
import { useGoogleFont } from '@/utils/fonts'; // Corrected import path
import React from "react";
import {
  Home,
  Briefcase,
  FileText,
  ClipboardList, // Changed from generic Search icon
  Users,
  DollarSign,
  FileBarChart2, // Changed from generic FileText
  CreditCard, // Changed from generic DollarSign
  Settings,
  Database, // Changed from generic Settings icon
  Bell,
  Calendar, // Added Calendar
  Search,
  ChevronLeft,
  ChevronRight,
  Monitor, // Changed from generic SVG
  Smartphone, // Changed from generic SVG
  Palette, // Changed from generic SVG
  ShieldCheck, // Changed from generic SVG
  CheckCircle, // Added CheckCircle
  UserPlus, // Added UserPlus
  MessageSquare, // Added MessageSquare
  Activity as ActivityIcon, // Renamed to avoid conflict with component
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress"; // Import Progress
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { Separator } from "@/components/ui/separator"; // Import Separator

export default function AdminDashboardPage() {
  const fontFamily = useGoogleFont('Inter');
  const [isCommunicationExpanded, setIsCommunicationExpanded] = React.useState(true);
  const [isNavExpanded, setIsNavExpanded] = React.useState(true);

  // Calculate main content margins based on sidebar states
  const leftMargin = isNavExpanded ? 'ml-64' : 'ml-[70px]';
  const rightMargin = isCommunicationExpanded ? 'mr-80' : 'mr-[70px]';

  // Mock Data for Recent Activity & Upcoming Tasks
  const activities = [
     { id: 1, user: "Website Redesign", action: "project has been completed", time: "2 hours ago", icon: CheckCircle, iconColor: "text-emerald-500", bgColor: "bg-emerald-100" },
     { id: 2, user: "Sarah Johnson", action: "joined the team as a UI Designer", time: "5 hours ago", icon: UserPlus, iconColor: "text-blue-500", bgColor: "bg-blue-100" },
     { id: 3, user: "Mobile App", action: "project deadline has been extended", time: "Yesterday", icon: Bell, iconColor: "text-amber-500", bgColor: "bg-amber-100"},
     { id: 4, user: "$12,500", action: "payment received from TechStart", time: "2 days ago", icon: DollarSign, iconColor: "text-primary", bgColor: "bg-sidebar-accent" },
  ];

  const tasks = [
      { id: 1, description: "Client meeting with TechStart team", time: "Today, 2:00 PM", tag: "Urgent", tagColor: "bg-red-100 text-red-800" },
      { id: 2, description: "Review and approve website mockups", time: "Today, 5:00 PM", tag: "Important", tagColor: "bg-amber-100 text-amber-800" },
      { id: 3, description: "Send invoice to Acme Inc.", time: "Tomorrow, 10:00 AM", tag: "Normal", tagColor: "bg-muted text-muted-foreground" },
      { id: 4, description: "Prepare presentation for GreenLife project", time: "Tomorrow, 2:00 PM", tag: "Important", tagColor: "bg-amber-100 text-amber-800" },
      { id: 5, description: "Team weekly planning meeting", time: "Friday, 11:00 AM", tag: "Normal", tagColor: "bg-muted text-muted-foreground" },
  ];

  const messages = [
     { id: 1, sender: "Alex Chen", initials: "AC", preview: "Hi John, I've reviewed the project timeline and have some questions...", time: "10:42 AM", unread: true, active: false, avatarBg: "bg-sidebar-accent", avatarText: "text-primary" },
     { id: 2, sender: "Sarah Johnson", initials: "SJ", preview: "The new designs are ready for review. Let me know what you think!", time: "9:15 AM", unread: true, active: true, avatarBg: "bg-emerald-100", avatarText: "text-emerald-800" },
     { id: 3, sender: "TechStart Team", initials: "TS", preview: "We need to schedule a call to discuss the next phase of the project...", time: "Yesterday", unread: false, active: false, avatarBg: "bg-blue-100", avatarText: "text-blue-800" },
     { id: 4, sender: "Michael Park", initials: "MP", preview: "Thanks for the update. I'll review the documents and get back to you...", time: "Yesterday", unread: false, active: false, avatarBg: "bg-amber-100", avatarText: "text-amber-800" },
     { id: 5, sender: "GreenLife", initials: "GL", preview: "We're very happy with the initial concepts. When can we expect...", time: "Monday", unread: false, active: false, avatarBg: "bg-purple-100", avatarText: "text-purple-800" },
  ];

  return (
    <div className="min-h-screen bg-background flex" style={{ fontFamily }}>
      {/* Left sidebar - fixed */}
      <aside className={`fixed left-0 top-0 bottom-0 ${isNavExpanded ? 'w-64' : 'w-[70px]'} bg-sidebar-background border-r border-sidebar-border z-20 flex flex-col transition-all duration-300`}>
        {/* Logo area */}
        <div className="h-[70px] flex items-center px-6 border-b border-sidebar-border bg-sidebar-primary">
          {isNavExpanded ? (
            <h1 className="text-xl font-light tracking-wide text-sidebar-primary-foreground">Task<span className="text-accent">Verse</span></h1>
          ) : (
            <h1 className="text-xl font-light tracking-wide text-sidebar-primary-foreground">T<span className="text-accent">V</span></h1>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-6">
          <div className="px-4 mb-4">
            {isNavExpanded && <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2">Main</p>}
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md bg-sidebar-accent text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <Home className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>Dashboard</span>}
            </a>
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <Briefcase className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>Projects</span>}
            </a>
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <FileText className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>Orders</span>}
            </a>
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <ClipboardList className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>Tasks</span>}
            </a>
          </div>

          <div className="px-4 mb-4">
            {isNavExpanded && <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2">Users</p>}
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <Users className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>Clients</span>}
            </a>
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <Users className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>Freelancers</span>}
            </a>
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <Users className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>Administrators</span>}
            </a>
          </div>

          <div className="px-4 mb-4">
            {isNavExpanded && <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2">Finance</p>}
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <DollarSign className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>Transactions</span>}
            </a>
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <FileBarChart2 className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>Reports</span>}
            </a>
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <CreditCard className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>Payments</span>}
            </a>
          </div>

          <div className="px-4">
            {isNavExpanded && <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2">Settings</p>}
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <Settings className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>General Settings</span>}
            </a>
            <a href="#" className={`flex items-center ${isNavExpanded ? 'px-2 py-2' : 'px-0 py-2 justify-center'} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}>
              <Database className={`${isNavExpanded ? 'h-5 w-5 mr-3' : 'h-6 w-6'}`} />
              {isNavExpanded && <span>Reference Data</span>}
            </a>
          </div>
        </ScrollArea>

        {/* User profile */}
        <div className={`p-4 border-t border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground ${isNavExpanded ? '' : 'flex justify-center'}`}>
          {isNavExpanded ? (
            <div className="flex items-center">
              <Avatar className="w-10 h-10 mr-3">
                <AvatarFallback className="bg-white/20 text-sidebar-primary-foreground">JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-light">John Doe</p>
                <p className="text-xs text-muted">Administrator</p> {/* Use muted for role */}
              </div>
            </div>
          ) : (
             <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-white/20 text-sidebar-primary-foreground">JD</AvatarFallback>
             </Avatar>
          )}
        </div>

        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsNavExpanded(!isNavExpanded)}
          className="absolute -right-3 top-20 bg-background rounded-full p-1 shadow-md border border-border text-muted-foreground hover:text-primary cursor-pointer h-auto w-auto"
        >
          {isNavExpanded ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${leftMargin} ${rightMargin} transition-all duration-300`}>
        {/* Header */}
        <header className="h-[70px] bg-card border-b border-border flex items-center justify-between px-8">
          <h2 className="text-xl font-light text-foreground">Dashboard</h2>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary cursor-pointer">
              <Bell className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary cursor-pointer">
              <Calendar className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary cursor-pointer">
              <Search className="h-6 w-6" />
            </Button>
          </div>
        </header>

        {/* Dashboard content */}
        <ScrollArea className="flex-1 p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-muted-foreground text-sm font-light">Total Projects</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">+12.5%</span>
              </div>
              <p className="text-3xl font-light text-foreground mb-1">142</p>
              <p className="text-sm text-muted-foreground">12 new this month</p>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-muted-foreground text-sm font-light">Active Clients</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">+7.2%</span>
              </div>
              <p className="text-3xl font-light text-foreground mb-1">64</p>
              <p className="text-sm text-muted-foreground">8 new this month</p>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-muted-foreground text-sm font-light">Total Revenue</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">+22.5%</span>
              </div>
              <p className="text-3xl font-light text-foreground mb-1">$86,589</p>
              <p className="text-sm text-muted-foreground">$12,480 this month</p>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-muted-foreground text-sm font-light">Pending Tasks</h3>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">+3.8%</span>
              </div>
              <p className="text-3xl font-light text-foreground mb-1">24</p>
              <p className="text-sm text-muted-foreground">6 due today</p>
            </div>
          </div>

          {/* Recent projects - Card layout */}
          <div className="bg-card rounded-lg shadow-sm border border-border mb-8">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-light text-foreground">Recent Projects</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Project Card 1 */}
              <div className="bg-muted border border-border rounded-lg p-6 hover:border-primary transition-colors">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded bg-sidebar-accent text-primary flex items-center justify-center mr-4 flex-shrink-0">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-light text-foreground">Website Redesign</h4>
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">In Progress</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Complete redesign of e-commerce website with modern UI/UX and improved checkout flow.</p>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Client</p>
                        <p className="text-sm font-light text-foreground">Acme Inc.</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                        <p className="text-sm font-light text-foreground">Dec 15, 2023</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Budget</p>
                        <p className="text-sm font-light text-foreground">$4,500</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <p className="text-xs text-muted-foreground">65%</p>
                      </div>
                      <Progress value={65} className="h-2 [&>div]:bg-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Card 2 */}
              <div className="bg-muted border border-border rounded-lg p-6 hover:border-primary transition-colors">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded bg-blue-100 text-blue-800 flex items-center justify-center mr-4 flex-shrink-0">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-light text-foreground">Mobile App Development</h4>
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">On Hold</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Native mobile application for iOS and Android with offline capabilities and push notifications.</p>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Client</p>
                        <p className="text-sm font-light text-foreground">TechStart</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                        <p className="text-sm font-light text-foreground">Jan 30, 2024</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Budget</p>
                        <p className="text-sm font-light text-foreground">$12,000</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <p className="text-xs text-muted-foreground">25%</p>
                      </div>
                       <Progress value={25} className="h-2 [&>div]:bg-amber-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Card 3 */}
              <div className="bg-muted border border-border rounded-lg p-6 hover:border-primary transition-colors">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded bg-purple-100 text-purple-800 flex items-center justify-center mr-4 flex-shrink-0">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-light text-foreground">Brand Identity</h4>
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">In Progress</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Complete brand identity package including logo, color palette, typography, and brand guidelines.</p>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Client</p>
                        <p className="text-sm font-light text-foreground">GreenLife</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                        <p className="text-sm font-light text-foreground">Nov 22, 2023</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Budget</p>
                        <p className="text-sm font-light text-foreground">$3,200</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <p className="text-xs text-muted-foreground">80%</p>
                      </div>
                      <Progress value={80} className="h-2 [&>div]:bg-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Card 4 */}
              <div className="bg-muted border border-border rounded-lg p-6 hover:border-primary transition-colors">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mr-4 flex-shrink-0">
                   <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-light text-foreground">Security Audit</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Completed</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Comprehensive security audit of web application including penetration testing and vulnerability assessment.</p>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Client</p>
                        <p className="text-sm font-light text-foreground">SecureBank</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                        <p className="text-sm font-light text-foreground">Oct 10, 2023</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Budget</p>
                        <p className="text-sm font-light text-foreground">$8,750</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <p className="text-xs text-muted-foreground">100%</p>
                      </div>
                       <Progress value={100} className="h-2 [&>div]:bg-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity and Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg shadow-sm border border-border">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-light text-foreground">Recent Activity</h3>
                <Button variant="link" className="text-sm text-primary hover:underline p-0 h-auto">View All</Button>
              </div>
              <div className="p-6">
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-4 w-px bg-border"></div>
                  {activities.map((activity) => (
                     <div key={activity.id} className="relative flex items-start mb-6">
                         <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.bgColor} ${activity.iconColor} flex items-center justify-center z-10 mr-4`}>
                            <activity.icon className="h-4 w-4" />
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
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-light text-foreground">Upcoming Tasks</h3>
                 <Button variant="link" className="text-sm text-primary hover:underline p-0 h-auto">View All</Button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center">
                        <Checkbox id={`task-${task.id}`} className="h-4 w-4 text-primary rounded border-border focus:ring-primary mr-3" />
                        <div className="flex-1">
                        <label htmlFor={`task-${task.id}`} className="text-sm font-light text-foreground cursor-pointer">{task.description}</label>
                        <p className="text-xs text-muted-foreground">{task.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${task.tagColor}`}>{task.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right sidebar - Communications */}
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
             <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-card p-0">
                <TabsTrigger value="messages" className="flex-1 py-3 text-sm font-light rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card hover:text-primary">Messages</TabsTrigger>
                <TabsTrigger value="notifications" className="flex-1 py-3 text-sm font-light rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card hover:text-primary">Notifications</TabsTrigger>
                <TabsTrigger value="activity" className="flex-1 py-3 text-sm font-light rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card hover:text-primary">Activity</TabsTrigger>
             </TabsList>

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

             <ScrollArea className="flex-1">
                <TabsContent value="messages" className="mt-0">
                    {messages.map((message) => (
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
                    ))}
                </TabsContent>

                <TabsContent value="notifications" className="mt-0 p-4 space-y-4">
                     {/* Reuse notification rendering from previous step or implement here */}
                    <p className="text-sm text-muted-foreground text-center py-8">No new notifications.</p>
                 </TabsContent>

                 <TabsContent value="activity" className="mt-0 p-6">
                    <div className="relative">
                        <div className="absolute top-0 bottom-0 left-4 w-px bg-border"></div>
                        {activities.map((activity) => (
                           <div key={activity.id} className="relative flex items-start mb-6">
                               <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.bgColor} ${activity.iconColor} flex items-center justify-center z-10 mr-4`}>
                                   <activity.icon className="h-4 w-4" />
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
    </div>
  )
}

