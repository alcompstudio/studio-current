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
      data-oid="qfiu13k"
    >
      {/* Left sidebar - fixed */}
      <aside
        className={`fixed left-0 top-0 bottom-0 ${isNavExpanded ? "w-64" : "w-[70px]"} bg-sidebar-background border-r border-sidebar-border z-20 flex flex-col transition-all duration-300`}
        data-oid="w-1-toc"
      >
        {/* Logo area */}
        <div
          className="h-[70px] flex items-center justify-center gap-2 px-6 border-b border-sidebar-border bg-sidebar-primary"
          data-oid="1.em1hz"
        >
          <h1
            className="text-xl font-light tracking-wide text-sidebar-primary-foreground group-data-[state=expanded]:block hidden"
            data-oid="gxg1zsn"
          >
            Freelan
            <span className="text-accent" data-oid="oyvcefg">
              Center
            </span>{" "}
            {/* Updated text and color */}
          </h1>
          <h1
            className="text-xl font-light tracking-wide text-sidebar-primary-foreground group-data-[state=collapsed]:block hidden"
            data-oid="nkxcl7l"
          >
            F
            <span className="text-accent" data-oid="kcw9k3z">
              C
            </span>{" "}
            {/* Updated 'C' to accent color */}
          </h1>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-6" data-oid=".wo.ibh">
          <div className="px-4 mb-4" data-oid="toubuo2">
            {isNavExpanded && (
              <p
                className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2"
                data-oid="8g2syn9"
              >
                Main
              </p>
            )}
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md bg-sidebar-accent text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="r2k86il"
            >
              <Home
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="bl_j0n4"
              />

              {isNavExpanded && <span data-oid="kol3ifs">Dashboard</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="5frugzu"
            >
              <Briefcase
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="yz3-egq"
              />

              {isNavExpanded && <span data-oid="0x_nhc.">Projects</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="e234yu7"
            >
              <FileText
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="fx-zqyy"
              />

              {isNavExpanded && <span data-oid="3u4rriu">Orders</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="v0q32kf"
            >
              <ClipboardList
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="06_4nwv"
              />

              {isNavExpanded && <span data-oid="qqatusw">Tasks</span>}
            </a>
          </div>

          <div className="px-4 mb-4" data-oid="n6eor_x">
            {isNavExpanded && (
              <p
                className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2"
                data-oid="1.-1sqn"
              >
                Users
              </p>
            )}
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="u:5gq_k"
            >
              <Users
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="r.w1lme"
              />

              {isNavExpanded && <span data-oid="rzzkasr">Clients</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="wgyo.yf"
            >
              <Users
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="c-1xvtq"
              />

              {isNavExpanded && <span data-oid=":9axxux">Freelancers</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="pf1w.pf"
            >
              <Users
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="_a1qve2"
              />

              {isNavExpanded && <span data-oid="2cb1kay">Administrators</span>}
            </a>
          </div>

          <div className="px-4 mb-4" data-oid="o91.4wf">
            {isNavExpanded && (
              <p
                className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2"
                data-oid="3h64dz3"
              >
                Finance
              </p>
            )}
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="m7kmmq9"
            >
              <DollarSign
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="rxlv8jr"
              />

              {isNavExpanded && <span data-oid="2t0.guj">Transactions</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="zhfjkig"
            >
              <FileBarChart2
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="2lt1fe_"
              />

              {isNavExpanded && <span data-oid="8imls79">Reports</span>}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="kirs79z"
            >
              <CreditCard
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="56y7p8z"
              />

              {isNavExpanded && <span data-oid="p0k3pxx">Payments</span>}
            </a>
          </div>

          <div className="px-4" data-oid=".i_y4lo">
            {isNavExpanded && (
              <p
                className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2"
                data-oid="mdek3i_"
              >
                Settings
              </p>
            )}
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="qvuon9r"
            >
              <Settings
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid=".h8929o"
              />

              {isNavExpanded && (
                <span data-oid="9ebn5o0">General Settings</span>
              )}
            </a>
            <a
              href="#"
              className={`flex items-center ${isNavExpanded ? "px-2 py-2" : "px-0 py-2 justify-center"} rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1 cursor-pointer`}
              data-oid="ykct05u"
            >
              <Database
                className={`${isNavExpanded ? "h-5 w-5 mr-3" : "h-6 w-6"}`}
                data-oid="v5y3ocj"
              />

              {isNavExpanded && <span data-oid="qvu6k4x">Reference Data</span>}
            </a>
          </div>
        </ScrollArea>

        {/* User profile */}
        <div
          className={`p-4 border-t border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground ${isNavExpanded ? "" : "flex justify-center"}`}
          data-oid="z5fbfe1"
        >
          {isNavExpanded ? (
            <div className="flex items-center" data-oid="z6potn_">
              <Avatar className="w-10 h-10 mr-3" data-oid="30.u9wq">
                <AvatarFallback
                  className="bg-white/20 text-sidebar-primary-foreground"
                  data-oid="htn3zdb"
                >
                  JD
                </AvatarFallback>
              </Avatar>
              <div data-oid="0so7uff">
                <p className="text-sm font-light" data-oid="e-f33c:">
                  John Doe
                </p>
                <p className="text-xs text-muted" data-oid="3ny2go5">
                  Administrator
                </p>{" "}
                {/* Use muted for role */}
              </div>
            </div>
          ) : (
            <Avatar className="w-10 h-10" data-oid=":o:14jg">
              <AvatarFallback
                className="bg-white/20 text-sidebar-primary-foreground"
                data-oid="wiw:e9."
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
          data-oid="rf46ouz"
        >
          {isNavExpanded ? (
            <ChevronLeft className="h-5 w-5" data-oid="_rw:1.w" />
          ) : (
            <ChevronRight className="h-5 w-5" data-oid="_7n-1g9" />
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
        data-oid="hft:733"
      >
        {/* Header */}
        <header
          className="h-[70px] bg-card border-b border-border flex items-center justify-between px-8"
          data-oid="99wb7n9"
        >
          <h2 className="text-xl font-light text-foreground" data-oid="lqldt9b">
            Dashboard
          </h2>

          <div className="flex items-center space-x-4" data-oid="w-pqetu">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary cursor-pointer"
              data-oid="l93fw4g"
            >
              <Bell className="h-6 w-6" data-oid=".l-5k5h" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary cursor-pointer"
              data-oid="3_.jr7_"
            >
              <Calendar className="h-6 w-6" data-oid=":mty1h6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary cursor-pointer"
              data-oid="t8j6u-:"
            >
              <Search className="h-6 w-6" data-oid="g_s09x4" />
            </Button>
          </div>
        </header>

        {/* Dashboard content */}
        <ScrollArea className="flex-1 p-8" data-oid="q9a88qy">
          {/* Stats */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            data-oid="ghw4vlj"
          >
            <Card data-oid="ku_3llr">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid="7os0pjz"
              >
                <CardTitle
                  className="text-sm font-medium text-muted-foreground"
                  data-oid="dk6pxb4"
                >
                  Total Projects
                </CardTitle>
                <span
                  className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded"
                  data-oid="2uuwoz9"
                >
                  +12.5%
                </span>
              </CardHeader>
              <CardContent data-oid=".aud03w">
                <p
                  className="text-3xl font-light text-foreground mb-1"
                  data-oid="42yrrcp"
                >
                  142
                </p>
                <p className="text-sm text-muted-foreground" data-oid="9jlis1x">
                  12 new this month
                </p>
              </CardContent>
            </Card>

            <Card data-oid="_u-a3ip">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid=".pk8bfo"
              >
                <CardTitle
                  className="text-sm font-medium text-muted-foreground"
                  data-oid="ze0.d3m"
                >
                  Active Clients
                </CardTitle>
                <span
                  className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded"
                  data-oid=":hfizuv"
                >
                  +7.2%
                </span>
              </CardHeader>
              <CardContent data-oid="san8kco">
                <p
                  className="text-3xl font-light text-foreground mb-1"
                  data-oid="bc16stb"
                >
                  64
                </p>
                <p className="text-sm text-muted-foreground" data-oid="euue2lz">
                  8 new this month
                </p>
              </CardContent>
            </Card>

            <Card data-oid="60:8w8p">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid="35r9qyn"
              >
                <CardTitle
                  className="text-sm font-medium text-muted-foreground"
                  data-oid="saea_dj"
                >
                  Total Revenue
                </CardTitle>
                <span
                  className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded"
                  data-oid="vl0wrtw"
                >
                  +22.5%
                </span>
              </CardHeader>
              <CardContent data-oid="emojj6-">
                <p
                  className="text-3xl font-light text-foreground mb-1"
                  data-oid="3.vj2r2"
                >
                  $86,589
                </p>
                <p className="text-sm text-muted-foreground" data-oid="tk01:kc">
                  $12,480 this month
                </p>
              </CardContent>
            </Card>

            <Card data-oid="_1h_mss">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid="9dpcz4c"
              >
                <CardTitle
                  className="text-sm font-medium text-muted-foreground"
                  data-oid="ixzi-c3"
                >
                  Pending Tasks
                </CardTitle>
                <span
                  className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded"
                  data-oid="xz9pnn4"
                >
                  +3.8%
                </span>
              </CardHeader>
              <CardContent data-oid="pi1xhse">
                <p
                  className="text-3xl font-light text-foreground mb-1"
                  data-oid="..0ordx"
                >
                  24
                </p>
                <p className="text-sm text-muted-foreground" data-oid="mbe_4ny">
                  6 due today
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent projects - Card layout */}
          <Card className="mb-8" data-oid="0f81b1.">
            <CardHeader data-oid="rhlj7hs">
              <CardTitle
                className="text-lg font-light text-foreground"
                data-oid="pejqbh0"
              >
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-oid=":g5ft7a">
              {/* Project Card 1 */}
              <Card
                className="bg-muted hover:border-primary transition-colors"
                data-oid="_x2jlao"
              >
                <CardContent className="p-6" data-oid="w.11ehq">
                  <div className="flex items-start" data-oid=".cb6xai">
                    <div
                      className="w-10 h-10 rounded bg-sidebar-accent text-primary flex items-center justify-center mr-4 flex-shrink-0"
                      data-oid="dizx9zk"
                    >
                      <Monitor className="h-5 w-5" data-oid="j0s_h3u" />
                    </div>
                    <div className="flex-1" data-oid="03zmluz">
                      <div
                        className="flex justify-between items-start mb-2"
                        data-oid="jdm6hg7"
                      >
                        <h4
                          className="text-lg font-light text-foreground"
                          data-oid="8s0swz1"
                        >
                          Website Redesign
                        </h4>
                        <span
                          className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded"
                          data-oid="_nifd:8"
                        >
                          In Progress
                        </span>
                      </div>
                      <p
                        className="text-sm text-muted-foreground mb-4"
                        data-oid="6min87x"
                      >
                        Complete redesign of e-commerce website with modern
                        UI/UX and improved checkout flow.
                      </p>
                      <div
                        className="flex justify-between items-center mb-3"
                        data-oid="ojx602:"
                      >
                        <div data-oid="v9gjhwp">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="rn2whng"
                          >
                            Client
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid=".3s6.8a"
                          >
                            Acme Inc.
                          </p>
                        </div>
                        <div data-oid="j0e4iym">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="_rqbog."
                          >
                            Deadline
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="m9e1obk"
                          >
                            Dec 15, 2023
                          </p>
                        </div>
                        <div data-oid="t-pdike">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="i1r43hs"
                          >
                            Budget
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="i-z6qnp"
                          >
                            $4,500
                          </p>
                        </div>
                      </div>
                      <div data-oid="7tgnge2">
                        <div
                          className="flex justify-between items-center mb-1"
                          data-oid="3ediv-p"
                        >
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="ua_g.3q"
                          >
                            Progress
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="edarsfh"
                          >
                            65%
                          </p>
                        </div>
                        <Progress
                          value={65}
                          className="h-2 [&>div]:bg-emerald-500"
                          data-oid="ni1qbmi"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Card 2 */}
              <Card
                className="bg-muted hover:border-primary transition-colors"
                data-oid="3bc659k"
              >
                <CardContent className="p-6" data-oid="48frgx3">
                  <div className="flex items-start" data-oid="tapub1r">
                    <div
                      className="w-10 h-10 rounded bg-blue-100 text-blue-800 flex items-center justify-center mr-4 flex-shrink-0"
                      data-oid="232hy1u"
                    >
                      <Smartphone className="h-5 w-5" data-oid="-9bqg6c" />
                    </div>
                    <div className="flex-1" data-oid="acrc_y3">
                      <div
                        className="flex justify-between items-start mb-2"
                        data-oid="ea6yn_x"
                      >
                        <h4
                          className="text-lg font-light text-foreground"
                          data-oid="vf-7bmz"
                        >
                          Mobile App Development
                        </h4>
                        <span
                          className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded"
                          data-oid="8t:448q"
                        >
                          On Hold
                        </span>
                      </div>
                      <p
                        className="text-sm text-muted-foreground mb-4"
                        data-oid="lteuiu3"
                      >
                        Native mobile application for iOS and Android with
                        offline capabilities and push notifications.
                      </p>
                      <div
                        className="flex justify-between items-center mb-3"
                        data-oid=":wce9bj"
                      >
                        <div data-oid="9-ldq7x">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="t2tn9.k"
                          >
                            Client
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="s72sjg."
                          >
                            TechStart
                          </p>
                        </div>
                        <div data-oid="luoh5rz">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="i58uobb"
                          >
                            Deadline
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="mz-ylm8"
                          >
                            Jan 30, 2024
                          </p>
                        </div>
                        <div data-oid="d1vwcbx">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="r_n-hcm"
                          >
                            Budget
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="46l0fx7"
                          >
                            $12,000
                          </p>
                        </div>
                      </div>
                      <div data-oid="b0e:1ny">
                        <div
                          className="flex justify-between items-center mb-1"
                          data-oid="s9lk_es"
                        >
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="7bs6wme"
                          >
                            Progress
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="2hbs76:"
                          >
                            25%
                          </p>
                        </div>
                        <Progress
                          value={25}
                          className="h-2 [&>div]:bg-amber-500"
                          data-oid="q2r-dzm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Card 3 */}
              <Card
                className="bg-muted hover:border-primary transition-colors"
                data-oid="vs0.8gl"
              >
                <CardContent className="p-6" data-oid="34n912x">
                  <div className="flex items-start" data-oid="quh8.ti">
                    <div
                      className="w-10 h-10 rounded bg-purple-100 text-purple-800 flex items-center justify-center mr-4 flex-shrink-0"
                      data-oid="zub.9s2"
                    >
                      <Palette className="h-5 w-5" data-oid="fvgyptw" />
                    </div>
                    <div className="flex-1" data-oid="cv__plh">
                      <div
                        className="flex justify-between items-start mb-2"
                        data-oid="v_z5d16"
                      >
                        <h4
                          className="text-lg font-light text-foreground"
                          data-oid="etzjz_:"
                        >
                          Brand Identity
                        </h4>
                        <span
                          className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded"
                          data-oid="8-qweiz"
                        >
                          In Progress
                        </span>
                      </div>
                      <p
                        className="text-sm text-muted-foreground mb-4"
                        data-oid="fsvb717"
                      >
                        Complete brand identity package including logo, color
                        palette, typography, and brand guidelines.
                      </p>
                      <div
                        className="flex justify-between items-center mb-3"
                        data-oid="36mufcg"
                      >
                        <div data-oid="hjb-ipl">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="koy-fz8"
                          >
                            Client
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="gd:7.dw"
                          >
                            GreenLife
                          </p>
                        </div>
                        <div data-oid="xa-arn5">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="cb4yduy"
                          >
                            Deadline
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="9m716va"
                          >
                            Nov 22, 2023
                          </p>
                        </div>
                        <div data-oid="z6jk1m.">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="9ue4mzd"
                          >
                            Budget
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="bvhkon4"
                          >
                            $3,200
                          </p>
                        </div>
                      </div>
                      <div data-oid="fhge8v8">
                        <div
                          className="flex justify-between items-center mb-1"
                          data-oid="eyl:83y"
                        >
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid=".8m7vsp"
                          >
                            Progress
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="2vub2r2"
                          >
                            80%
                          </p>
                        </div>
                        <Progress
                          value={80}
                          className="h-2 [&>div]:bg-emerald-500"
                          data-oid="bh9550e"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Card 4 */}
              <Card
                className="bg-muted hover:border-primary transition-colors"
                data-oid="-gvtl20"
              >
                <CardContent className="p-6" data-oid="82vpwob">
                  <div className="flex items-start" data-oid="8sn_5w7">
                    <div
                      className="w-10 h-10 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mr-4 flex-shrink-0"
                      data-oid="8wy9b-."
                    >
                      <ShieldCheck className="h-5 w-5" data-oid="pp5_01u" />
                    </div>
                    <div className="flex-1" data-oid="6pbp4lv">
                      <div
                        className="flex justify-between items-start mb-2"
                        data-oid="lmnqdf9"
                      >
                        <h4
                          className="text-lg font-light text-foreground"
                          data-oid="mjd1gn0"
                        >
                          Security Audit
                        </h4>
                        <span
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          data-oid="2jsup3l"
                        >
                          Completed
                        </span>
                      </div>
                      <p
                        className="text-sm text-muted-foreground mb-4"
                        data-oid="e5iqnnm"
                      >
                        Comprehensive security audit of web application
                        including penetration testing and vulnerability
                        assessment.
                      </p>
                      <div
                        className="flex justify-between items-center mb-3"
                        data-oid="8thi6qg"
                      >
                        <div data-oid="33go1qh">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="p44xpt4"
                          >
                            Client
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="g307pi."
                          >
                            SecureBank
                          </p>
                        </div>
                        <div data-oid="at-ku3z">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid="dzxfy_y"
                          >
                            Deadline
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="h2elu9s"
                          >
                            Oct 10, 2023
                          </p>
                        </div>
                        <div data-oid="mjf4wuv">
                          <p
                            className="text-xs text-muted-foreground mb-1"
                            data-oid=":npb.vo"
                          >
                            Budget
                          </p>
                          <p
                            className="text-sm font-light text-foreground"
                            data-oid="6ri5wp2"
                          >
                            $8,750
                          </p>
                        </div>
                      </div>
                      <div data-oid="ffqk24-">
                        <div
                          className="flex justify-between items-center mb-1"
                          data-oid="w331:pr"
                        >
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid="41mvl1q"
                          >
                            Progress
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            data-oid=":n_hp3m"
                          >
                            100%
                          </p>
                        </div>
                        <Progress
                          value={100}
                          className="h-2 [&>div]:bg-blue-500"
                          data-oid="iin2jx_"
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
            data-oid="vbnkui4"
          >
            <Card data-oid="92vj-l.">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid="vug8phb"
              >
                <CardTitle
                  className="text-lg font-light text-foreground"
                  data-oid="wqxdw33"
                >
                  Recent Activity
                </CardTitle>
                <Button
                  variant="link"
                  className="text-sm text-primary hover:underline p-0 h-auto"
                  data-oid="u:wdsuq"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent data-oid="ar..pix">
                <div className="relative" data-oid="qjprvog">
                  <div
                    className="absolute top-0 bottom-0 left-4 w-px bg-border"
                    data-oid="r7424vl"
                  ></div>
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="relative flex items-start mb-6"
                      data-oid="u2sl-8k"
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.bgColor} ${activity.iconColor} flex items-center justify-center z-10 mr-4`}
                        data-oid="lw7_2v6"
                      >
                        <activity.icon className="h-4 w-4" data-oid="hgzkgej" />
                      </div>
                      <div data-oid="vwc3gqg">
                        <p
                          className="text-sm font-light text-foreground"
                          data-oid="2w0f._b"
                        >
                          <span className="font-medium" data-oid="t6tey0i">
                            {activity.user}
                          </span>{" "}
                          {activity.action}
                        </p>
                        <p
                          className="text-xs text-muted-foreground mt-1"
                          data-oid="u_0.vq6"
                        >
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-oid="vxnj99e">
              <CardHeader
                className="flex flex-row items-center justify-between pb-2"
                data-oid="bm9wko:"
              >
                <CardTitle
                  className="text-lg font-light text-foreground"
                  data-oid="axl14kh"
                >
                  Upcoming Tasks
                </CardTitle>
                <Button
                  variant="link"
                  className="text-sm text-primary hover:underline p-0 h-auto"
                  data-oid="8nn9gv4"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent data-oid="iaqsu5i">
                <div className="space-y-4" data-oid="3hcn6sv">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center"
                      data-oid="ef83b5-"
                    >
                      <Checkbox
                        id={`task-${task.id}`}
                        className="h-4 w-4 text-primary rounded border-border focus:ring-primary mr-3"
                        data-oid="g4ok-sy"
                      />

                      <div className="flex-1" data-oid="cc3g2q:">
                        <label
                          htmlFor={`task-${task.id}`}
                          className="text-sm font-light text-foreground cursor-pointer"
                          data-oid="abd04ar"
                        >
                          {task.description}
                        </label>
                        <p
                          className="text-xs text-muted-foreground"
                          data-oid="7_o390j"
                        >
                          {task.time}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${task.tagColor}`}
                        data-oid="bx39229"
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
        data-oid="77sv3uf"
      />
    </div>
  );
}
