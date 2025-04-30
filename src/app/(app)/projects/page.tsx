import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Briefcase, CheckCircle, Clock } from "lucide-react"; // Added icons
import { Badge } from "@/components/ui/badge"; // Import Badge
import Link from "next/link"; // Import Link

// Mock project data
const mockProjects = [
  { id: "proj_1", name: "E-commerce Platform Revamp", description: "Complete overhaul of the existing online store.", status: "In Progress", clientName: "RetailCo", budget: 15000, currency: "USD" },
  { id: "proj_2", name: "Mobile Banking App", description: "Develop a native mobile app for iOS and Android.", status: "Planning", clientName: "FinTech Solutions", budget: 25000, currency: "USD" },
  { id: "proj_3", name: "Content Marketing Strategy", description: "Create a 6-month content plan and initial articles.", status: "Completed", clientName: "Startup Hub", budget: 5000, currency: "USD" },
  { id: "proj_4", name: "Cloud Migration Assessment", description: "Analyze current infrastructure and propose cloud solutions.", status: "In Progress", clientName: "Enterprise Corp", budget: 8000, currency: "USD" },
  { id: "proj_5", name: "Social Media Campaign", description: "Run a targeted ad campaign on Facebook and Instagram.", status: "On Hold", clientName: "Local Cafe", budget: 2000, currency: "USD" },
  { id: "proj_6", name: "Internal HR Portal", description: "Build a web portal for employee management.", status: "In Progress", clientName: "Manufacturing Inc.", budget: 18000, currency: "USD" },
  { id: "proj_7", name: "Data Analytics Dashboard", description: "Visualize sales data using Power BI.", status: "Completed", clientName: "SalesBoost", budget: 6000, currency: "USD" },
  { id: "proj_8", name: "Brand Identity Design", description: "Develop a new logo, color palette, and brand guidelines.", status: "Planning", clientName: "New Venture", budget: 4500, currency: "USD" },
  { id: "proj_9", name: "SEO Optimization Project", description: "Improve search engine rankings for the company website.", status: "In Progress", clientName: "Service Pro", budget: 7000, currency: "USD" },
  { id: "proj_10", name: "API Integration", description: "Connect third-party CRM with internal systems.", status: "On Hold", clientName: "Tech Innovate", budget: 9500, currency: "USD" },
];

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
            return <Briefcase className="mr-1 h-3 w-3" />; // Use Briefcase for Planning/On Hold
        case "On Hold":
             return <Clock className="mr-1 h-3 w-3 text-destructive-foreground" />; // Use clock with destructive text color
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
        {/* Add role check if needed */}
         {userRole === "Заказчик" && ( // Show button only for Заказчик (Client)
            <Button>
               <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
            </Button>
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
                  {/* TODO: Add progress bar or other relevant info */}
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
