import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Briefcase, DollarSign, PlusCircle } from "lucide-react";

export default function DashboardPage() {
  // Mock data - replace with actual data fetching based on user role
  const userRole = "Заказчик"; // or "Исполнитель", "Администратор"
  const activeProjects = 5;
  const pendingTasks = 12;
  const currentBalance = 1250.75;
  const currency = "USD";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        {userRole === "Заказчик" && (
           <Button>
             <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
           </Button>
        )}
         {userRole === "Исполнитель" && (
           <Button variant="outline">
             Find Orders
           </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">Projects currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
             {userRole === "Заказчик" && <p className="text-xs text-muted-foreground">Tasks awaiting approval or action</p>}
             {userRole === "Исполнитель" && <p className="text-xs text-muted-foreground">Tasks assigned to you</p>}
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
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for recent activity or project list */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Overview of recent actions and updates.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity to display.</p>
          {/* TODO: Populate with actual recent activity data */}
        </CardContent>
      </Card>
    </div>
  );
}
