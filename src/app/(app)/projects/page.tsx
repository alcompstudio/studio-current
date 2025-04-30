import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Briefcase, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { mockProjects } from './mockProjects'; // Import mock data

// Helper function to get status badge variant
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "In Progress":
      return "default"; // Primary color for active
    case "Completed":
      return "secondary"; // Secondary color for completed
    case "Planning":
      return "outline"; // Outline for planning
    case "On Hold":
      return "destructive"; // Destructive/Reddish for on hold
    default:
      return "secondary";
  }
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
    switch (status) {
        case "In Progress":
            return <Clock className="mr-1 h-3 w-3" />;
        case "Completed":
            return <CheckCircle className="mr-1 h-3 w-3" />;
        case "Planning":
            return <Briefcase className="mr-1 h-3 w-3" />;
        case "On Hold":
             return <Clock className="mr-1 h-3 w-3 text-destructive-foreground" />;
        default:
            return null;
    }
};


export default function ProjectsPage() {
  // TODO: Fetch and display projects based on user role
  const userRole = "Заказчик"; // Mock role - replace with actual role check

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
         {userRole === "Заказчик" && ( // Show button only for Заказчик (Client)
             <Link href="/projects/new" passHref>
                <Button>
                   <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
                </Button>
            </Link>
         )}
       </div>
       <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
          <CardDescription>Manage your ongoing and completed projects.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockProjects.length > 0 ? (
            mockProjects.map((project) => (
              <Card key={project.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                    <Badge variant={getStatusVariant(project.status)} className="flex items-center">
                         {getStatusIcon(project.status)}
                         {project.status}
                    </Badge>
                  </div>
                  <CardDescription>Client: {project.clientName} • Budget: {project.currency} {project.budget?.toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                   <Link href={`/projects/${project.id}`} passHref>
                     <Button variant="outline" size="sm">View Details</Button>
                   </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No projects created yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
