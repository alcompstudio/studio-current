import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ProjectsPage() {
  // TODO: Fetch and display projects based on user role
  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
        {/* Add role check if needed */}
         <Button>
           <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
         </Button>
       </div>
       <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
          <CardDescription>Manage your ongoing and completed projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No projects created yet.</p>
          {/* TODO: Implement project listing table/cards */}
        </CardContent>
      </Card>
    </div>
  );
}
