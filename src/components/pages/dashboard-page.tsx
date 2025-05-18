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
        data-oid="om1phjm"
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
        data-oid="et_dqoh"
      >
        User not found. Please log in.
      </div>
    );
  }

  const userRole = authUser.role;

  return (
    <div className="flex flex-col gap-6" data-oid="h58:la8">
      <div className="flex items-center justify-between" data-oid="9hymxjh">
        <h2 className="text-2xl font-bold tracking-tight" data-oid="x231146">
          Dashboard
        </h2>
        {userRole === "Заказчик" && (
          <Link href="/projects" passHref data-oid="da42h45">
            {" "}
            {/* Assuming /projects is where you create projects */}
            <Button variant="default" data-oid="113q2mb">
              <PlusCircle className="mr-2 h-4 w-4" data-oid="_htm5_e" /> Create
              New Project
            </Button>
          </Link>
        )}
        {userRole === "Исполнитель" && (
          <Link href="/find-orders" passHref data-oid="0rddgfv">
            <Button variant="outline" data-oid="kv0z:er">
              <SearchIcon className="mr-2 h-4 w-4" data-oid="mizy3ag" /> Find
              Orders {/* Use imported SearchIcon */}
            </Button>
          </Link>
        )}
        {/* Add button for Admin/Moderator if needed */}
      </div>

      <div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        data-oid="ldk-rwm"
      >
        <Card data-oid="gxps_p0">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-oid="hlpo8xi"
          >
            <CardTitle className="text-sm font-medium" data-oid="pljh3_c">
              {userRole === "Исполнитель"
                ? "Active Assignments"
                : "Active Projects"}
            </CardTitle>
            <Briefcase
              className="h-4 w-4 text-muted-foreground"
              data-oid="zuwa2gm"
            />
          </CardHeader>
          <CardContent data-oid="2:zyoxe">
            <div className="text-2xl font-bold" data-oid="0iub5so">
              {activeProjects}
            </div>
            <p className="text-xs text-muted-foreground" data-oid="stqf-aj">
              {userRole === "Исполнитель"
                ? "Assignments in progress"
                : "Projects currently in progress"}
            </p>
          </CardContent>
        </Card>
        <Card data-oid=":ptncaz">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-oid="f96c91s"
          >
            <CardTitle className="text-sm font-medium" data-oid="2zit7kd">
              {userRole === "Исполнитель" ? "Pending Tasks" : "Tasks Overview"}
            </CardTitle>
            <Activity
              className="h-4 w-4 text-muted-foreground"
              data-oid="wmng8gu"
            />
          </CardHeader>
          <CardContent data-oid="ah29:ey">
            <div className="text-2xl font-bold" data-oid="fc6zdii">
              {pendingTasks}
            </div>
            {userRole === "Заказчик" && (
              <p className="text-xs text-muted-foreground" data-oid="0m1pqq.">
                Tasks awaiting review or action
              </p>
            )}
            {userRole === "Исполнитель" && (
              <p className="text-xs text-muted-foreground" data-oid="a:zxo9o">
                Your assigned tasks requiring action
              </p>
            )}
            {(userRole === "Администратор" || userRole === "Модератор") && (
              <p className="text-xs text-muted-foreground" data-oid="58e0upy">
                Total pending tasks on platform
              </p>
            )}
          </CardContent>
        </Card>
        <Card data-oid="1x68:rf">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
            data-oid="cmmjlle"
          >
            <CardTitle className="text-sm font-medium" data-oid="iid.vp1">
              Account Balance
            </CardTitle>
            <DollarSign
              className="h-4 w-4 text-muted-foreground"
              data-oid="ke-t2ka"
            />
          </CardHeader>
          <CardContent data-oid="mo:gr7-">
            <div className="text-2xl font-bold" data-oid="g2tntph">
              {currency} {currentBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground" data-oid="8wlflsi">
              Your current internal balance
            </p>
            {/* Link to finance page */}
            <Link href="/finance" passHref data-oid="jdx:zsc">
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto mt-1"
                data-oid="zdifiix"
              >
                View Finance
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for recent activity or project list */}
      <Card data-oid="ui1r:af">
        <CardHeader data-oid="ga-rwa:">
          <CardTitle data-oid="0l-w9g8">Recent Activity</CardTitle>
          <CardDescription data-oid="m43sxft">
            Overview of recent actions and updates relevant to you.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid="o5.bys1">
          <p className="text-sm text-muted-foreground" data-oid="9ip.v7d">
            No recent activity to display.
          </p>
          {/* TODO: Populate with actual recent activity data (e.g., bids placed, tasks completed, messages received) */}
        </CardContent>
      </Card>
    </div>
  );
}
