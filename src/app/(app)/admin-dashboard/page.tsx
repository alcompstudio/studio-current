// src/app/(app)/admin-dashboard/page.tsx
"use client";
import { useGoogleFont } from "@/utils/fonts"; // Corrected import path
import React from "react";
import {
  Home,
  Briefcase,
  FileText,
  ClipboardList,
  Users,
  DollarSign,
  FileBarChart2,
  CreditCard,
  Settings,
  Database,
  Bell,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Palette,
  ShieldCheck,
  CheckCircle,
  UserPlus,
  MessageSquare,
  Activity as ActivityIcon,
  Pencil, // Added Pencil icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress"; // Import Progress
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { Separator } from "@/components/ui/separator"; // Import Separator
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Import Card components
import { cn } from "@/lib/utils"; // Import cn utility

export default function AdminDashboardPage() {
  const fontFamily = useGoogleFont("Inter");
  const [isCommunicationExpanded, setIsCommunicationExpanded] =
    React.useState(true);
  const [isNavExpanded, setIsNavExpanded] = React.useState(true);

  // Calculate main content margins based on sidebar states
  const leftMargin = isNavExpanded ? "ml-64" : "ml-[70px]";
  const rightMargin = isCommunicationExpanded ? "mr-80" : "mr-[70px]";

  // Mock Data for Recent Activity & Upcoming Tasks
  const activities = [
    {
      id: 1,
      user: "Website Redesign",
      action: "project has been completed",
      time: "2 hours ago",
      icon: CheckCircle,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-100",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      action: "joined the team as a UI Designer",
      time: "5 hours ago",
      icon: UserPlus,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      id: 3,
      user: "Mobile App",
      action: "project deadline has been extended",
      time: "Yesterday",
      icon: Bell,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-100",
    },
    {
      id: 4,
      user: "$12,500",
      action: "payment received from TechStart",
      time: "2 days ago",
      icon: DollarSign,
      iconColor: "text-primary",
      bgColor: "bg-sidebar-accent",
    },
  ];

  const tasks = [
    {
      id: 1,
      description: "Client meeting with TechStart team",
      time: "Today, 2:00 PM",
      tag: "Urgent",
      tagColor: "bg-red-100 text-red-800",
    },
    {
      id: 2,
      description: "Review and approve website mockups",
      time: "Today, 5:00 PM",
      tag: "Important",
      tagColor: "bg-amber-100 text-amber-800",
    },
    {
      id: 3,
      description: "Send invoice to Acme Inc.",
      time: "Tomorrow, 10:00 AM",
      tag: "Normal",
      tagColor: "bg-muted text-muted-foreground",
    },
    {
      id: 4,
      description: "Prepare presentation for GreenLife project",
      time: "Tomorrow, 2:00 PM",
      tag: "Important",
      tagColor: "bg-amber-100 text-amber-800",
    },
    {
      id: 5,
      description: "Team weekly planning meeting",
      time: "Friday, 11:00 AM",
      tag: "Normal",
      tagColor: "bg-muted text-muted-foreground",
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
  ];

  return (
    <div
      className="min-h-screen bg-background flex"
      style={{ fontFamily }}
      data-oid="85za27m"
    >
      {/* Left sidebar - fixed */}
      <aside
        className={`fixed left-0 top-0 bottom-0 ${isNavExpanded ? "w-64" : "w-[70px]"} bg-sidebar-background border-r border-sidebar-border z-20 flex flex-col transition-all duration-300`}
        data-oid="_n-.8_p"
      >
        {/* Logo area */}
        <div
          className="h-[70px] flex items-center justify-center gap-2 px-6 border-b border-sidebar-border bg-sidebar-primary"
          data-oid="vwclhjh"
        >
          <h1
            className="text-xl font-light tracking-wide text-sidebar-primary-foreground group-data-[state=expanded]:block hidden"
            data-oid="j3v4mu9"
          >
            Freelan
            <span className="text-accent" data-oid="9f3uc-h">
              Center
            </span>{" "}
            {/* Updated text and color */}
          </h1>
          <h1
            className="text-xl font-light tracking-wide text-sidebar-primary-foreground group-data-[state=collapsed]:block hidden"
            data-oid="zxloa92"
          >
            F
            <span className="text-accent" data-oid="hhd7l1c">
              C
            </span>{" "}
            {/* Updated 'C' to accent color */}
          </h1>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-6" data-oid="mp7-y-.">
          <div className="px-4 mb-4" data-oid="zb74kdd">
            {isNavExpanded && (
              <p
                className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2"
                data-oid="y8jiz7b"
              >
                Main
              </p>
            )}
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md bg-sidebar-accent text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid=".0zk8l4"
            >
              <Home
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="wk-tqu1"
              />

              {isNavExpanded && <span data-oid="wlpry5:">Dashboard</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="xfuqb:_"
            >
              <Briefcase
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="b5cw82z"
              />

              {isNavExpanded && <span data-oid="a4vov6v">Projects</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid=":-dtgx7"
            >
              <FileText
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="_z9itle"
              />

              {isNavExpanded && <span data-oid="nei-i0l">Orders</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="e:8bufx"
            >
              <ClipboardList
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="ixq:o:9"
              />

              {isNavExpanded && <span data-oid="_wb2-xm">Tasks</span>}
            </a>
          </div>

          <div className="px-4 mb-4" data-oid="g5bvdz7">
            {isNavExpanded && (
              <p
                className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2"
                data-oid="4qbj21r"
              >
                Users
              </p>
            )}
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="6w:0g9i"
            >
              <Users
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="grqh2:s"
              />

              {isNavExpanded && <span data-oid="otpc-nd">Clients</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="pgvyro4"
            >
              <Users
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="f2.g2x."
              />

              {isNavExpanded && <span data-oid="ng6srae">Freelancers</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="bgfxrar"
            >
              <Users
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="5.:--h:"
              />

              {isNavExpanded && <span data-oid="r00mu4m">Administrators</span>}
            </a>
          </div>

          <div className="px-4 mb-4" data-oid="583_ddc">
            {isNavExpanded && (
              <p
                className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2"
                data-oid="wj-i41q"
              >
                Finance
              </p>
            )}
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="da914g9"
            >
              <DollarSign
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="v7a:y4d"
              />

              {isNavExpanded && <span data-oid="y82c7rm">Transactions</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="c9s0ov:"
            >
              <FileBarChart2
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="5p686jc"
              />

              {isNavExpanded && <span data-oid="a4gmx2a">Reports</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="2dh2.7q"
            >
              <CreditCard
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="wcyxiba"
              />

              {isNavExpanded && <span data-oid="b622isq">Payments</span>}
            </a>
          </div>

          <div className="px-4" data-oid="k.7-_ko">
            {isNavExpanded && (
              <p
                className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2"
                data-oid="duih.v:"
              >
                Settings
              </p>
            )}
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="upthrmy"
            >
              <Settings
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="4-z6mi:"
              />

              {isNavExpanded && (
                <span data-oid="6nmx8av">General Settings</span>
              )}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="vsbd7of"
            >
              <Database
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid=":7crw--"
              />

              {isNavExpanded && <span data-oid=":g02jcx">Reference Data</span>}
            </a>
          </div>
        </ScrollArea>

        {/* User profile */}
        <div
          className={`p-4 border-t border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground ${isNavExpanded ? "" : "flex justify-center"}`}
          data-oid="x46su:f"
        >
          {isNavExpanded ? (
            <div className="flex items-center" data-oid=".v0rmb6">
              <Avatar className="w-10 h-10 mr-3" data-oid=":y6x6sm">
                <AvatarFallback
                  className="bg-white/20 text-sidebar-primary-foreground"
                  data-oid="oxrdjj-"
                >
                  JD
                </AvatarFallback>
              </Avatar>
              <div data-oid="wtlnno0">
                <p className="text-sm font-light" data-oid="uq8krk6">
                  John Doe
                </p>
                <p className="text-xs text-muted" data-oid="9zvkib.">
                  Administrator
                </p>{" "}
                {/* Use muted for role */}
              </div>
            </div>
          ) : (
            <Avatar className="w-10 h-10" data-oid="cpmo1uj">
              <AvatarFallback
                className="bg-white/20 text-sidebar-primary-foreground"
                data-oid="jdx373d"
              >
                JD
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsNavExpanded(!isNavExpanded)}
          className="absolute -right-3 top-20 bg-background rounded-full p-1 shadow-sm border border-border text-muted-foreground hover:text-primary cursor-pointer h-auto w-auto" // Use shadow-sm
          data-oid="m1-oskj"
        >
          {isNavExpanded ? (
            <ChevronLeft className="h-5 w-5" data-oid="5_a_byc" />
          ) : (
            <ChevronRight className="h-5 w-5" data-oid="me1kdao" />
          )}
        </Button>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          leftMargin,
          rightMargin,
        )}
        data-oid="mjk76qc"
      >
        {/* Header */}
        <header
          className="h-[70px] bg-card border-b border-border flex items-center justify-between px-8"
          data-oid="fr4ap:h"
        >
          <h2 className="text-xl font-light text-foreground" data-oid="u2j9-w.">
            Dashboard
          </h2>

          <div className="flex items-center space-x-4" data-oid="w16om7o">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary cursor-pointer"
              data-oid="zsb4-g6"
            >
              <Bell className="h-6 w-6" data-oid="icoehgf" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary cursor-pointer"
              data-oid="39b5s9a"
            >
              <Calendar className="h-6 w-6" data-oid="s4ayvwi" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary cursor-pointer"
              data-oid="6qxlgbj"
            >
              <Search className="h-6 w-6" data-oid="pm-l6im" />
            </Button>
          </div>
        </header>

        {/* Dashboard content */}
        <ScrollArea className="flex-1 p-8" data-oid="uk.u-j0">
          {/* Stats */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            data-oid="u_9.e.u"
          >
            <Card data-oid="dkwzpt.">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid="ivq4.tq"
              >
                <CardTitle
                  className="text-sm font-medium text-muted-foreground"
                  data-oid="k1lo2g1"
                >
                  Total Projects
                </CardTitle>
                <span
                  className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded"
                  data-oid=":mif-sh"
                >
                  +12.5%
                </span>
              </CardHeader>
              <CardContent data-oid="7s4f_l2">
                <p
                  className="text-3xl font-light text-foreground mb-1"
                  data-oid="jxcmyo:"
                >
                  142
                </p>
                <p className="text-sm text-muted-foreground" data-oid="ages97y">
                  12 new this month
                </p>
              </CardContent>
            </Card>

            <Card data-oid="96tub_r">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid="509cwor"
              >
                <CardTitle
                  className="text-sm font-medium text-muted-foreground"
                  data-oid="l4rvmqs"
                >
                  Active Clients
                </CardTitle>
                <span
                  className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded"
                  data-oid="c8f2i_j"
                >
                  +7.2%
                </span>
              </CardHeader>
              <CardContent data-oid="tbwm3cy">
                <p
                  className="text-3xl font-light text-foreground mb-1"
                  data-oid="qd3hc7i"
                >
                  64
                </p>
                <p className="text-sm text-muted-foreground" data-oid="operq.q">
                  8 new this month
                </p>
              </CardContent>
            </Card>

            <Card data-oid="jugx.z2">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid="q_71jqw"
              >
                <CardTitle
                  className="text-sm font-medium text-muted-foreground"
                  data-oid="_geespg"
                >
                  Total Revenue
                </CardTitle>
                <span
                  className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded"
                  data-oid="k2fktab"
                >
                  +22.5%
                </span>
              </CardHeader>
              <CardContent data-oid="t_:-tfc">
                <p
                  className="text-3xl font-light text-foreground mb-1"
                  data-oid="1bw5gxx"
                >
                  $86,589
                </p>
                <p className="text-sm text-muted-foreground" data-oid="bbg9q8p">
                  $12,480 this month
                </p>
              </CardContent>
            </Card>

            <Card data-oid="2pqyibm">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid="-85pg15"
              >
                <CardTitle
                  className="text-sm font-medium text-muted-foreground"
                  data-oid="sxm0ijw"
                >
                  Pending Tasks
                </CardTitle>
                <span
                  className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded"
                  data-oid="rid8.td"
                >
                  +3.8%
                </span>
              </CardHeader>
              <CardContent data-oid="ay5xvig">
                <p
                  className="text-3xl font-light text-foreground mb-1"
                  data-oid="h35ktqy"
                >
                  24
                </p>
                <p className="text-sm text-muted-foreground" data-oid="vtpc80a">
                  6 due today
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent projects - Card layout */}
          <Card className="mb-8" data-oid="r56o1rr">
            <CardHeader data-oid="sjs6cv8">
              <CardTitle
                className="text-lg font-light text-foreground"
                data-oid="7_y_bj:"
              >
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid="f3evwgf">
              {/* Project Card 1 */}
              <Card
                className="bg-muted hover:border-primary transition-colors"
                data-oid="bpz59np"
              >
                <CardContent className="p-6" data-oid="r3c-9fw">
                  <div className="flex items-start" data-oid="wk-l99q">
                    <div
                      className="w-10 h-10 rounded bg-sidebar-accent text-primary flex items-center justify-center mr-4 flex-shrink-0"
                      data-oid="ul3p5dk"
                    >
                      <Monitor className="h-5 w-5" data-oid="117is_l" />
                    </div>
                    <div className="flex-1" data-oid="ufpj4zz">
                      <div
                        className="flex justify-between items-start mb-2"
                        data-oid=".bye8v2"
                      >
                        <h4
                          className="text-lg font-light text-foreground"
                          data-oid="hvep.hg"
                        >
                          Website Redesign
                        </h4>
                        <span
                          className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded"
                          data-oid="ixv3s9r"
                        >
                          In Progress
                        </span>
                      </div>
                      <p
                        className="text-sm text-muted-foreground mb-4"
                        data-oid="seg2hea"
                      >
                        Complete redesign of e-commerce website with modern
                        UI/UX and improved checkout flow.
                      </p>
                      <div
                        className="flex justify-between items-center mb-3"
                        data-oid="2hpzh:k"
                      >
                        <div data-oid="lnk_a1q">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="ny4k75d"
                          >
                            Client
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="pd13wuj"
                          >
                            Acme Inc.
                          </p>
                        </div>
                        <div data-oid="m_t_aoj">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="10_pekw"
                          >
                            Deadline
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="s.92fl4"
                          >
                            Dec 15, 2023
                          </p>
                        </div>
                        <div data-oid="r3334rz">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="c_9fyb1"
                          >
                            Budget
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="r3_136d"
                          >
                            $4,500
                          </p>
                        </div>
                      </div>
                      <div data-oid="m86jr5y">
                        <div
                          className="flex justify-between items-center mb-1"
                          data-oid="bgy6si-"
                        >
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="iix11am"
                          >
                            Progress
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="2srcosn"
                          >
                            65%
                          </p>
                        </div>
                        <Progress
                          value={65}
                          className="h-2 [&>div]:bg-emerald-500"
                          data-oid="y6ir.4a"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Card 2 */}
              <Card
                className="bg-muted hover:border-primary transition-colors"
                data-oid="8f9daw3"
              >
                <CardContent className="p-6" data-oid="-v759kj">
                  <div className="flex items-start" data-oid="r_15hpo">
                    <div
                      className="w-10 h-10 rounded bg-blue-100 text-blue-800 flex items-center justify-center mr-4 flex-shrink-0"
                      data-oid="fq:p_x:"
                    >
                      <Smartphone className="h-5 w-5" data-oid="8lq451:" />
                    </div>
                    <div className="flex-1" data-oid="rzplbvr">
                      <div
                        className="flex justify-between items-start mb-2"
                        data-oid="79lw.n9"
                      >
                        <h4
                          className="text-lg font-light text-foreground"
                          data-oid="d2ol107"
                        >
                          Mobile App Development
                        </h4>
                        <span
                          className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded"
                          data-oid="yq-0fe7"
                        >
                          On Hold
                        </span>
                      </div>
                      <p
                        className="text-sm text-muted-foreground mb-4"
                        data-oid="vc0dr0n"
                      >
                        Native mobile application for iOS and Android with
                        offline capabilities and push notifications.
                      </p>
                      <div
                        className="flex justify-between items-center mb-3"
                        data-oid="c7ucwk-"
                      >
                        <div data-oid="84-3l6r">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="6il.ziy"
                          >
                            Client
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="6m6gjaw"
                          >
                            TechStart
                          </p>
                        </div>
                        <div data-oid="8edql.e">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid=":rfbc8_"
                          >
                            Deadline
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="qdfe41n"
                          >
                            Jan 30, 2024
                          </p>
                        </div>
                        <div data-oid="gxsfbry">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="kx:i1ce"
                          >
                            Budget
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="xu2b_4s"
                          >
                            $12,000
                          </p>
                        </div>
                      </div>
                      <div data-oid="3.7ih:p">
                        <div
                          className="flex justify-between items-center mb-1"
                          data-oid="zmvdrxi"
                        >
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="ekbyans"
                          >
                            Progress
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="svt3sre"
                          >
                            25%
                          </p>
                        </div>
                        <Progress
                          value={25}
                          className="h-2 [&>div]:bg-amber-500"
                          data-oid="czvlos5"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Card 3 */}
              <Card
                className="bg-muted hover:border-primary transition-colors"
                data-oid="g:wy58d"
              >
                <CardContent className="p-6" data-oid=".ytvlfz">
                  <div className="flex items-start" data-oid="u51lb5n">
                    <div
                      className="w-10 h-10 rounded bg-purple-100 text-purple-800 flex items-center justify-center mr-4 flex-shrink-0"
                      data-oid="2qcyryy"
                    >
                      <Palette className="h-5 w-5" data-oid="nyzmq69" />
                    </div>
                    <div className="flex-1" data-oid="lwlvzsr">
                      <div
                        className="flex justify-between items-start mb-2"
                        data-oid="528szk3"
                      >
                        <h4
                          className="text-lg font-light text-foreground"
                          data-oid="uz_krl4"
                        >
                          Brand Identity
                        </h4>
                        <span
                          className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded"
                          data-oid="8jhbnsm"
                        >
                          In Progress
                        </span>
                      </div>
                      <p
                        className="text-sm text-muted-foreground mb-4"
                        data-oid="xwmh315"
                      >
                        Complete brand identity package including logo, color
                        palette, typography, and brand guidelines.
                      </p>
                      <div
                        className="flex justify-between items-center mb-3"
                        data-oid="n23-_g3"
                      >
                        <div data-oid="d6f49_p">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="t812j4-"
                          >
                            Client
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="jxkea00"
                          >
                            GreenLife
                          </p>
                        </div>
                        <div data-oid="-didkc_">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="t.2wfa-"
                          >
                            Deadline
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid=":i0jrzx"
                          >
                            Nov 22, 2023
                          </p>
                        </div>
                        <div data-oid="zvs.6x3">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="d.q83nc"
                          >
                            Budget
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="l.6unnc"
                          >
                            $3,200
                          </p>
                        </div>
                      </div>
                      <div data-oid="39uww36">
                        <div
                          className="flex justify-between items-center mb-1"
                          data-oid="p78it4r"
                        >
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid=".xcz:fw"
                          >
                            Progress
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="rp473pz"
                          >
                            80%
                          </p>
                        </div>
                        <Progress
                          value={80}
                          className="h-2 [&>div]:bg-emerald-500"
                          data-oid="..-higu"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Card 4 */}
              <Card
                className="bg-muted hover:border-primary transition-colors"
                data-oid="gt-h5w."
              >
                <CardContent className="p-6" data-oid="0rsn5l4">
                  <div className="flex items-start" data-oid="iol94zl">
                    <div
                      className="w-10 h-10 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mr-4 flex-shrink-0"
                      data-oid="hghl5o:"
                    >
                      <ShieldCheck className="h-5 w-5" data-oid="mg00dof" />
                    </div>
                    <div className="flex-1" data-oid="ekst6gn">
                      <div
                        className="flex justify-between items-start mb-2"
                        data-oid="37wtke7"
                      >
                        <h4
                          className="text-lg font-light text-foreground"
                          data-oid="5kclx32"
                        >
                          Security Audit
                        </h4>
                        <span
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          data-oid="8j.c28e"
                        >
                          Completed
                        </span>
                      </div>
                      <p
                        className="text-sm text-muted-foreground mb-4"
                        data-oid="rvzba2i"
                      >
                        Comprehensive security audit of web application
                        including penetration testing and vulnerability
                        assessment.
                      </p>
                      <div
                        className="flex justify-between items-center mb-3"
                        data-oid="rqn5r18"
                      >
                        <div data-oid="hj1lgw4">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="pzo7_-y"
                          >
                            Client
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="h3h.ki."
                          >
                            SecureBank
                          </p>
                        </div>
                        <div data-oid="ryxpiko">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="xqm9g2m"
                          >
                            Deadline
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="9xp0-ud"
                          >
                            Oct 10, 2023
                          </p>
                        </div>
                        <div data-oid="wu66x9r">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="xjol7o2"
                          >
                            Budget
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="unbkuc2"
                          >
                            $8,750
                          </p>
                        </div>
                      </div>
                      <div data-oid="5-1ftic">
                        <div
                          className="flex justify-between items-center mb-1"
                          data-oid="m7723yz"
                        >
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="skxv07z"
                          >
                            Progress
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="6tlmi-6"
                          >
                            100%
                          </p>
                        </div>
                        <Progress
                          value={100}
                          className="h-2 [&>div]:bg-blue-500"
                          data-oid="r_fs7eq"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Activity and Tasks */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            data-oid="w_bk.hv"
          >
            <Card data-oid="kesva5-">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid="n6i_n50"
              >
                <CardTitle
                  className="text-lg font-light text-foreground"
                  data-oid=".zxhk0f"
                >
                  Recent Activity
                </CardTitle>
                <Button
                  variant="link"
                  className="text-sm text-primary hover:underline p-0 h-auto"
                  data-oid="t.ouul0"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent data-oid="uwxwpba">
                <div className="relative" data-oid="1nb6clb">
                  <div
                    className="absolute top-0 bottom-0 left-4 w-px bg-border"
                    data-oid="h71c5ga"
                  ></div>
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="relative flex items-start mb-6"
                      data-oid="ibiyaku"
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.bgColor} ${activity.iconColor} flex items-center justify-center z-10 mr-4`}
                        data-oid="0l2l6ie"
                      >
                        <activity.icon className="h-4 w-4" data-oid="cm-nnkj" />
                      </div>
                      <div data-oid="kuf_y71">
                        <p
                          className="text-sm font-light text-foreground"
                          data-oid="i7neyar"
                        >
                          <span className="font-medium" data-oid="5tpsaij">
                            {activity.user}
                          </span>{" "}
                          {activity.action}
                        </p>
                        <p
                          className="text-xs text-muted-foreground mt-1"
                          data-oid=".9..0mw"
                        >
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-oid="7s-9num">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid="af3dgza"
              >
                <CardTitle
                  className="text-lg font-light text-foreground"
                  data-oid="ouj:vtu"
                >
                  Upcoming Tasks
                </CardTitle>
                <Button
                  variant="link"
                  className="text-sm text-primary hover:underline p-0 h-auto"
                  data-oid="2-269kq"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent data-oid="apepqr3">
                <div className="space-y-4" data-oid=".j3umhw">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center"
                      data-oid=":hydecn"
                    >
                      <Checkbox
                        id={`task-${task.id}`}
                        className="h-4 w-4 text-primary rounded border-border focus:ring-primary mr-3"
                        data-oid=".jssp06"
                      />

                      <div className="flex-1" data-oid="ppycnmz">
                        <label
                          htmlFor={`task-${task.id}`}
                          className="text-sm font-light text-foreground cursor-pointer"
                          data-oid="_4dj3l6"
                        >
                          {task.description}
                        </label>
                        <p
                          className="text-xs text-muted-foreground"
                          data-oid="r07w2je"
                        >
                          {task.time}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${task.tagColor}`}
                        data-oid="y82wmxo"
                      >
                        {task.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* Right sidebar - Communications */}
      <CommunicationPanel
        isExpanded={isCommunicationExpanded}
        setIsExpanded={setIsCommunicationExpanded}
        data-oid="-jyp4rj"
      />
    </div>
  );
}
