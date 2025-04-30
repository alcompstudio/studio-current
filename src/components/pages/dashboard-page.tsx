
"use client"; // Need client for localStorage access

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Briefcase, DollarSign, PlusCircle, Search as SearchIcon } from "lucide-react"; // Renamed Search icon
import Link from 'next/link'; // Import Link for navigation
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
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
        try {
            const user: AuthUser = JSON.parse(storedUser);
            if (user && user.role) {
                setAuthUser(user);
            }
        } catch (error) {
            console.error("Error parsing authUser from localStorage on dashboard", error);
            // Handle error, maybe redirect to login
        }
    }
    setIsLoading(false);
   }, []);


  // Mock data - replace with actual data fetching based on user role
  const activeProjects = authUser?.role === 'Заказчик' ? 5 : (authUser?.role === 'Исполнитель' ? 3 : 10); // Example logic
  const pendingTasks = authUser?.role === 'Заказчик' ? 12 : (authUser?.role === 'Исполнитель' ? 8 : 20);
  const currentBalance = 1250.75; // Needs actual fetching
  const currency = "USD"; // Needs actual fetching/setting

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading Dashboard...</div>;
  }

  if (!authUser) {
      // Should have been redirected by layout, but fallback
      return <div className="flex min-h-screen items-center justify-center">User not found. Please log in.</div>;
  }

  const userRole = authUser.role;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        {userRole === "Заказчик" && (
           <Link href="/projects" passHref> {/* Assuming /projects is where you create projects */}
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
              </Button>
            </Link>
        )}
         {userRole === "Исполнитель" && (
            <Link href="/find-orders" passHref>
               <Button variant="outline">
                  <SearchIcon className="mr-2 h-4 w-4" /> Find Orders {/* Use imported SearchIcon */}
               </Button>
            </Link>
        )}
        {/* Add button for Admin/Moderator if needed */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {userRole === 'Исполнитель' ? 'Active Assignments' : 'Active Projects'}
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
                {userRole === 'Исполнитель' ? 'Assignments in progress' : 'Projects currently in progress'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {userRole === 'Исполнитель' ? 'Pending Tasks' : 'Tasks Overview'}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
             {userRole === "Заказчик" && <p className="text-xs text-muted-foreground">Tasks awaiting review or action</p>}
             {userRole === "Исполнитель" && <p className="text-xs text-muted-foreground">Your assigned tasks requiring action</p>}
             {(userRole === "Администратор" || userRole === "Модератор") && <p className="text-xs text-muted-foreground">Total pending tasks on platform</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currency} {currentBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Your current internal balance</p>
             {/* Link to finance page */}
             <Link href="/finance" passHref>
                <Button variant="link" size="sm" className="p-0 h-auto mt-1">View Finance</Button>
             </Link>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for recent activity or project list */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Overview of recent actions and updates relevant to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity to display.</p>
          {/* TODO: Populate with actual recent activity data (e.g., bids placed, tasks completed, messages received) */}
        </CardContent>
      </Card>
    </div>
  );
}

