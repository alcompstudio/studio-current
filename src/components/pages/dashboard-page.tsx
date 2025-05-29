"use client"; // Need client for localStorage access

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Briefcase,
  DollarSign,
  PlusCircle,
  Search as SearchIcon,
} from "lucide-react"; // Renamed Search icon
import Link from "next/link"; // Import Link for navigation
import type { UserRole } from "@/lib/types"; // Use type import

interface AuthUser {
  email: string;
  role: UserRole;
}

export default function DashboardPage() {
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch user info from localStorage on mount
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const user: AuthUser = JSON.parse(storedUser);
        if (user && user.role) {
          setAuthUser(user);
        }
      } catch (error) {
        console.error(
          "Error parsing authUser from localStorage on dashboard",
          error,
        );
        // Handle error, maybe redirect to login
      }
    }
    setIsLoading(false);
  }, []);

  // Mock data - replace with actual data fetching based on user role
  const activeProjects =
    authUser?.role === "Заказчик"
      ? 5
      : authUser?.role === "Исполнитель"
        ? 3
        : 10; // Example logic
  const pendingTasks =
    authUser?.role === "Заказчик"
      ? 12
      : authUser?.role === "Исполнитель"
        ? 8
        : 20;
  const currentBalance = 1250.75; // Needs actual fetching
  const currency = "USD"; // Needs actual fetching/setting

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        data-oid="k8xsrv-"
      >
        Loading Dashboard...
      </div>
    );
  }

  if (!authUser) {
    // Should have been redirected by layout, but fallback
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        data-oid="fi4nux8"
      >
        User not found. Please log in.
      </div>
    );
  }

  const userRole = authUser.role;

  return (
    <div className="flex flex-col gap-6" data-oid="lh7s:lf">
      <div className="flex items-center justify-between" data-oid="luuq1a:">
        <h2 className="text-2xl font-bold tracking-tight" data-oid="siyfrfs">
          Dashboard
        </h2>
        {userRole === "Заказчик" && (
          <Link href="/projects" passHref data-oid="4zxr:wu">
            {" "}
            {/* Assuming /projects is where you create projects */}
            <Button variant="default" data-oid="4xzjjob">
              <PlusCircle className="mr-2 h-4 w-4" data-oid="ltxza3c" /> Create
              New Project
            </Button>
          </Link>
        )}
        {userRole === "Исполнитель" && (
          <Link href="/find-orders" passHref data-oid="3.-v3g1">
            <Button variant="outline" data-oid="84i5tpn">
              <SearchIcon className="mr-2 h-4 w-4" data-oid="5bm90av" /> Find
              Orders {/* Use imported SearchIcon */}
            </Button>
          </Link>
        )}
        {/* Add button for Admin/Moderator if needed */}
      </div>

      <div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        data-oid="yooa3ny"
      >
        <Card data-oid="3rqd31k">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-oid="9xd-cjh"
          >
            <CardTitle className="text-sm font-medium" data-oid="uvk.gtl">
              {userRole === "Исполнитель"
                ? "Active Assignments"
                : "Active Projects"}
            </CardTitle>
            <Briefcase
              className="h-4 w-4 text-muted-foreground"
              data-oid="ig3rf.p"
            />
          </CardHeader>
          <CardContent data-oid="ol59nb_">
            <div className="text-2xl font-bold" data-oid="kp9km3m">
              {activeProjects}
            </div>
            <p className="text-xs text-muted-foreground" data-oid=".s:ei3d">
              {userRole === "Исполнитель"
                ? "Assignments in progress"
                : "Projects currently in progress"}
            </p>
          </CardContent>
        </Card>
        <Card data-oid="wvtvnvt">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-oid="iyz7q6v"
          >
            <CardTitle className="text-sm font-medium" data-oid="_i6r:6s">
              {userRole === "Исполнитель" ? "Pending Tasks" : "Tasks Overview"}
            </CardTitle>
            <Activity
              className="h-4 w-4 text-muted-foreground"
              data-oid="pxnd_gj"
            />
          </CardHeader>
          <CardContent data-oid="br0p5w.">
            <div className="text-2xl font-bold" data-oid="x090zni">
              {pendingTasks}
            </div>
            {userRole === "Заказчик" && (
              <p className="text-xs text-muted-foreground" data-oid=":cloj:m">
                Tasks awaiting review or action
              </p>
            )}
            {userRole === "Исполнитель" && (
              <p className="text-xs text-muted-foreground" data-oid="810b2:.">
                Your assigned tasks requiring action
              </p>
            )}
            {(userRole === "Администратор" || userRole === "Модератор") && (
              <p className="text-xs text-muted-foreground" data-oid="e:pesct">
                Total pending tasks on platform
              </p>
            )}
          </CardContent>
        </Card>
        <Card data-oid="7njr6l0">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-oid="iro4092"
          >
            <CardTitle className="text-sm font-medium" data-oid="e1u-:.h">
              Account Balance
            </CardTitle>
            <DollarSign
              className="h-4 w-4 text-muted-foreground"
              data-oid="phkpj45"
            />
          </CardHeader>
          <CardContent data-oid="_g.lq:d">
            <div className="text-2xl font-bold" data-oid="zxyc5m_">
              {currency} {currentBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground" data-oid="q0x9lm7">
              Your current internal balance
            </p>
            {/* Link to finance page */}
            <Link href="/finance" passHref data-oid="584wcpp">
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto mt-1"
                data-oid="g0zehxn"
              >
                View Finance
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for recent activity or project list */}
      <Card data-oid="b-w1lg7">
        <CardHeader data-oid=".bmaupz">
          <CardTitle data-oid="lzcif2e">Recent Activity</CardTitle>
          <CardDescription data-oid="a2tiz1a">
            Overview of recent actions and updates relevant to you.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="yu9quq4">
          <p className="text-sm text-muted-foreground" data-oid="9wu77re">
            No recent activity to display.
          </p>
          {/* TODO: Populate with actual recent activity data (e.g., bids placed, tasks completed, messages received) */}
        </CardContent>
      </Card>
    </div>
  );
}
