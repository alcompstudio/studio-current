// src/app/(app)/projects/[projectId]/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, PlusCircle, FileText, Briefcase, Users, DollarSign, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import type { Project } from "@/lib/types"; // Assuming Project type exists

// Mock project data (same as in projects/page.tsx)
const mockProjects: Project[] = [
  { id: "proj_1", name: "E-commerce Platform Revamp", description: "Complete overhaul of the existing online store.", status: "In Progress", clientName: "RetailCo", budget: 15000, currency: "USD", createdAt: new Date(), updatedAt: new Date(), clientId: "client_1" },
  { id: "proj_2", name: "Mobile Banking App", description: "Develop a native mobile app for iOS and Android.", status: "Planning", clientName: "FinTech Solutions", budget: 25000, currency: "USD", createdAt: new Date(), updatedAt: new Date(), clientId: "client_2" },
  { id: "proj_3", name: "Content Marketing Strategy", description: "Create a 6-month content plan and initial articles.", status: "Completed", clientName: "Startup Hub", budget: 5000, currency: "USD", createdAt: new Date(), updatedAt: new Date(), clientId: "client_3" },
  { id: "proj_4", name: "Cloud Migration Assessment", description: "Analyze current infrastructure and propose cloud solutions.", status: "In Progress", clientName: "Enterprise Corp", budget: 8000, currency: "USD", createdAt: new Date(), updatedAt: new Date(), clientId: "client_4" },
  { id: "proj_5", name: "Social Media Campaign", description: "Run a targeted ad campaign on Facebook and Instagram.", status: "On Hold", clientName: "Local Cafe", budget: 2000, currency: "USD", createdAt: new Date(), updatedAt: new Date(), clientId: "client_5" },
  { id: "proj_6", name: "Internal HR Portal", description: "Build a web portal for employee management.", status: "In Progress", clientName: "Manufacturing Inc.", budget: 18000, currency: "USD", createdAt: new Date(), updatedAt: new Date(), clientId: "client_6" },
  { id: "proj_7", name: "Data Analytics Dashboard", description: "Visualize sales data using Power BI.", status: "Completed", clientName: "SalesBoost", budget: 6000, currency: "USD", createdAt: new Date(), updatedAt: new Date(), clientId: "client_7" },
  { id: "proj_8", name: "Brand Identity Design", description: "Develop a new logo, color palette, and brand guidelines.", status: "Planning", clientName: "New Venture", budget: 4500, currency: "USD", createdAt: new Date(), updatedAt: new Date(), clientId: "client_8" },
  { id: "proj_9", name: "SEO Optimization Project", description: "Improve search engine rankings for the company website.", status: "In Progress", clientName: "Service Pro", budget: 7000, currency: "USD", createdAt: new Date(), updatedAt: new Date(), clientId: "client_9" },
  { id: "proj_10", name: "API Integration", description: "Connect third-party CRM with internal systems.", status: "On Hold", clientName: "Tech Innovate", budget: 9500, currency: "USD", createdAt: new Date(), updatedAt: new Date(), clientId: "client_10" },
];

// Helper function to get status badge variant
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "In Progress": return "default";
    case "Completed": return "secondary";
    case "Planning": return "outline";
    case "On Hold": return "destructive";
    default: return "secondary";
  }
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
    switch (status) {
        case "In Progress": return <Clock className="mr-1 h-3 w-3" />;
        case "Completed": return <CheckCircle className="mr-1 h-3 w-3" />;
        case "Planning": return <Briefcase className="mr-1 h-3 w-3" />;
        case "On Hold": return <Clock className="mr-1 h-3 w-3 text-destructive-foreground" />;
        default: return null;
    }
};


export default function ProjectDetailPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params?.projectId;

    // TODO: Fetch actual project data based on projectId
    const project = mockProjects.find(p => p.id === projectId);

    if (!project) {
        return <div>Project not found.</div>; // Or a proper 404 page
    }

    // Mock user role for conditional rendering
    const userRole = "Заказчик"; // Replace with actual role check

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Link href="/projects" passHref>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold tracking-tight">{project.name}</h2>
                     <Badge variant={getStatusVariant(project.status)} className="flex items-center text-sm">
                         {getStatusIcon(project.status)}
                         {project.status}
                    </Badge>
                </div>
                {userRole === "Заказчик" && ( // Show edit button for Client
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" /> Edit Project
                    </Button>
                )}
            </div>

            {/* Project Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Client</p>
                        <p>{project.clientName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Budget</p>
                        <p>{project.currency} {project.budget?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Created</p>
                        <p>{project.createdAt?.toLocaleDateString() || 'N/A'}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Sections for related entities (Orders, Bids, etc.) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Orders</CardTitle>
                        {userRole === "Заказчик" && (
                             <Button size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" /> Create Order
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">No orders created for this project yet.</p>
                         {/* TODO: List orders related to this project */}
                    </CardContent>
                </Card>

                 {/* Team/Freelancers Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Team</CardTitle>
                        {/* Button to add/manage team? */}
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">No freelancers assigned to this project yet.</p>
                        {/* TODO: List freelancers associated with the project */}
                    </CardContent>
                </Card>

                {/* Work Assignments Section */}
                <Card className="lg:col-span-2">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Work Assignments</CardTitle>
                         {userRole === "Заказчик" && (
                            <Button size="sm" variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" /> Create Assignment
                            </Button>
                         )}
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">No work assignments created yet.</p>
                         {/* TODO: List work assignments related to this project */}
                    </CardContent>
                </Card>

                {/* Finance Summary Section */}
                <Card className="lg:col-span-2">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">Finance Summary</CardTitle>
                        <Link href="/finance" passHref>
                             <Button size="sm" variant="link">View Full Finance</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">Financial summary for this project will be displayed here.</p>
                         {/* TODO: Display project-specific financial overview (spent, remaining budget, etc.) */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


// Add missing Project type definition if not already globally available
interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  clientName?: string; // Assuming clientName is part of the fetched data
  clientId: string;
  budget?: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}
